import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseError } from 'src/utils/errors';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto) {
    try {
      const track = await this.prisma.track.create({
        data: createTrackDto,
      });
      return track;
    } catch (error) {
      throw parseError(error);
    }
  }

  async findAll() {
    const tracks = await this.prisma.track.findMany();
    return tracks || [];
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });
    if (!track) {
      throw new NotFoundException(`Track with id "${id}" not found`);
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });
    if (!track) {
      throw new NotFoundException(`Track with id "${id}" not found`);
    }
    try {
      const updatedTrack = await this.prisma.track.update({
        where: { id },
        data: updateTrackDto,
      });
      return updatedTrack;
    } catch (error) {
      throw parseError(error);
    }
  }

  async remove(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });
    if (!track) {
      throw new NotFoundException(`Track with id "${id}" not found`);
    }
    try {
      await this.prisma.track.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      throw parseError(error);
    }
  }
}
