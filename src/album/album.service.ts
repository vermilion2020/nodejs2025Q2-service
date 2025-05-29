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

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
  ) {}

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
    this.favsService.removeAlbum(id, true);
    albums.delete(id);
    return true;
  }
}
