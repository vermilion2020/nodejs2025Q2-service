import { Injectable, LoggerService } from '@nestjs/common';
import { appendFile, mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import {
  LogType,
  LOGS_FOLDER,
  LogLevel,
  DEFAULT_LOGS_MAX_FILE_SIZE,
  DEFAULT_LOGS_LEVEL,
} from '../utils';
import { join } from 'node:path';

@Injectable()
export class LoggingService implements LoggerService {
  currentIndexes: { log: number; error: number };
  maxFileSize: number;
  currentLogLevel: number;

  async setup() {
    await this.createLogFolder();
    this.currentIndexes = await this.getCurrentLogFileIndexes();
    this.maxFileSize =
      (+process.env.MAX_LOG_FILE_SIZE || DEFAULT_LOGS_MAX_FILE_SIZE) * 1024;
    this.currentLogLevel =
      process.env.LOG_LEVEL !== undefined
        ? +process.env.LOG_LEVEL
        : DEFAULT_LOGS_LEVEL;
  }

  async checkMaxLogFileSize(type: LogType) {
    const logFilePath = join(
      LOGS_FOLDER,
      `${type}_${this.currentIndexes[type]}.txt`,
    );
    try {
      const stats = await stat(logFilePath);
      if (stats.size > this.maxFileSize) {
        this.currentIndexes[type]++;
      }
    } catch (error) {
      await writeFile(logFilePath, '', { encoding: 'utf-8' });
    }
  }

  async writeLog(type: LogType, level: LogLevel, message: string) {
    if (level > this.currentLogLevel) {
      return;
    }
    await this.checkMaxLogFileSize(type);
    const logFilePath = join(
      LOGS_FOLDER,
      `${type}_${this.currentIndexes[type]}.txt`,
    );
    const logTime = new Date().toISOString();
    const newLine = `[${LogLevel[level]}] ${logTime} ${message}\r\n`;
    await appendFile(logFilePath, newLine);
  }

  async createLogFolder() {
    try {
      const stats = await stat(LOGS_FOLDER);
      if (stats.isDirectory()) {
        return;
      }
    } catch (error) {
      await mkdir(LOGS_FOLDER);
    }
  }

  async getCurrentLogFileIndexes() {
    const logFolderPath = join(LOGS_FOLDER);
    const logFiles = await readdir(logFolderPath);
    const { log, error } = logFiles
      .filter((file) => file.endsWith('.txt'))
      .reduce(
        (acc, file) => {
          const match = file.match(/^(\d+)\.txt$/);
          if (match) {
            acc[file.startsWith(LogType.LOG) ? 'log' : 'error'] = parseInt(
              match[1],
            );
          }
          return acc;
        },
        { log: 0, error: 0 },
      );
    return { log, error };
  }

  error(message: string) {
    this.writeLog(LogType.ERROR, LogLevel.ERROR, message);
  }

  warn(message: string) {
    this.writeLog(LogType.LOG, LogLevel.WARN, message);
  }

  log(message: string) {
    this.writeLog(LogType.LOG, LogLevel.LOG, message);
  }

  debug(message: string) {
    this.writeLog(LogType.LOG, LogLevel.DEBUG, message);
  }

  verbose(message: string) {
    this.writeLog(LogType.LOG, LogLevel.VERBOSE, message);
  }
}
