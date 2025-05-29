import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { tracks } from 'src/db/db';
import { randomUUID } from 'node:crypto';

@Injectable()
export class TrackService {
  create(createTrackDto: CreateTrackDto) {
    const track = {
      id: randomUUID(),
      ...createTrackDto,
    };
    tracks.set(track.id, track);
    return track;
  }

  findAll() {
    return Array.from(tracks.values());
  }

  findOne(id: string) {
    if (!tracks.has(id)) {
      throw new NotFoundException(`Track with id "${id}" not found`);
    }
    return tracks.get(id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!tracks.has(id)) {
      throw new NotFoundException(`Track with id "${id}" not found`);
    }
    const updatedTrack = {
      ...tracks.get(id),
      ...updateTrackDto,
    };
    tracks.set(id, updatedTrack);
    return updatedTrack;
  }

  remove(id: string) {
    if (!tracks.has(id)) {
      throw new NotFoundException(`Track with id "${id}" not found`);
    }
    tracks.delete(id);
    return true;
  }
}
