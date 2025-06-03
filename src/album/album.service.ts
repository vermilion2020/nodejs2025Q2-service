import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { randomUUID } from 'node:crypto';
import { albums } from '../db/db';
import { FavsService } from 'src/favs/favs.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  create(createAlbumDto: CreateAlbumDto) {
    const album = {
      id: randomUUID(),
      ...createAlbumDto,
    };
    albums.push(album);
    return album;
  }

  findAll() {
    return albums;
  }

  setNullArtist(id: string) {
    const ids = this.findAll()
      .filter((album) => album.artistId === id)
      .map((album) => album.id);
    ids.forEach((id) => {
      const album = albums.find((album) => album.id === id);
      if (album) {
        album.artistId = null;
        albums.push(album);
      }
    });
  }

  findOne(id: string) {
    const album = albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException(`Album with id "${id}" not found`);
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const index = albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new NotFoundException(`Album with id "${id}" not found`);
    }
    const updatedAlbum = {
      ...albums[index],
      ...updateAlbumDto,
    };
    albums[index] = updatedAlbum;
    return updatedAlbum;
  }

  remove(id: string) {
    const index = albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new NotFoundException(`Album with id "${id}" not found`);
    }
    this.favsService.removeAlbum(id, true);
    this.trackService.setNullAlbum(id);
    albums.splice(index, 1);
    return true;
  }
}
