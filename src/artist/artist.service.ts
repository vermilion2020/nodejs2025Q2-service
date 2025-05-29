import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { randomUUID } from 'node:crypto';
import { artists } from 'src/db/db';
import { FavsService } from 'src/favs/favs.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
  ) {}

  create(createArtistDto: CreateArtistDto) {
    const artist = {
      id: randomUUID(),
      ...createArtistDto,
    };
    artists.set(artist.id, artist);
    return artist;
  }

  findAll() {
    return Array.from(artists.values());
  }

  findOne(id: string) {
    const artist = artists.get(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = artists.get(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    const updatedArtist = { ...artist, ...updateArtistDto };
    artists.set(id, updatedArtist);
    return updatedArtist;
  }

  remove(id: string) {
    if (!artists.has(id)) {
      throw new NotFoundException('Artist not found');
    }
    this.favsService.removeArtist(id, true);

    artists.delete(id);
    return true;
  }
}
