import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { tracks } from 'src/db/db';
import { randomUUID } from 'node:crypto';
import { FavsService } from 'src/favs/favs.service';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
  ) {}

  create(createTrackDto: CreateTrackDto) {
    const track = {
      id: randomUUID(),
      ...createTrackDto,
    };
    tracks.push(track);
    return track;
  }

  findAll() {
    return Array.from(tracks.values());
  }

  findOne(id: string) {
    const index = tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new NotFoundException(`Track with id "${id}" not found`);
    }
    return tracks[index];
  }

  setNullArtist(id: string) {
    const ids = this.findAll()
      .filter((track) => track.artistId === id)
      .map((album) => album.id);
    ids.forEach((id) => {
      const track = tracks.find((track) => track.id === id);
      if (track) {
        track.artistId = null;
        tracks.push(track);
      }
    });
  }

  setNullAlbum(id: string) {
    const ids = this.findAll()
      .filter((track) => track.albumId === id)
      .map((album) => album.id);
    ids.forEach((id) => {
      const track = tracks.find((track) => track.id === id);
      if (track) {
        track.albumId = null;
        tracks.push(track);
      }
    });
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const index = tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new NotFoundException(`Track with id "${id}" not found`);
    }
    const updatedTrack = {
      ...tracks[index],
      ...updateTrackDto,
    };
    tracks[index] = updatedTrack;
    return updatedTrack;
  }

  remove(id: string) {
    const index = tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new NotFoundException(`Track with id "${id}" not found`);
    }
    this.favsService.removeTrack(id, true);
    tracks.splice(index, 1);
    return true;
  }
}
