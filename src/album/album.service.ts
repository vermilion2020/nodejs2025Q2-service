import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { randomUUID } from 'node:crypto';
import { albums } from '../db/db';

@Injectable()
export class AlbumService {
  create(createAlbumDto: CreateAlbumDto) {
    const album = {
      id: randomUUID(),
      ...createAlbumDto,
    };
    albums.set(album.id, album);
    return album;
  }

  findAll() {
    return Array.from(albums.values());
  }

  findOne(id: string) {
    if (!albums.has(id)) {
      throw new NotFoundException(`Album with id "${id}" not found`);
    }
    return albums.get(id);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!albums.has(id)) {
      throw new NotFoundException(`Album with id "${id}" not found`);
    }
    const updatedAlbum = {
      ...albums.get(id),
      ...updateAlbumDto,
    };
    albums.set(id, updatedAlbum);
    return updatedAlbum;
  }

  remove(id: string) {
    if (!albums.has(id)) {
      throw new NotFoundException(`Album with id "${id}" not found`);
    }
    albums.delete(id);
    return true;
  }
}
