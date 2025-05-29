import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { albums, artists, favs, tracks } from 'src/db/db';

@Injectable()
export class FavsService {
  findAll() {
    return {
      artists: Array.from(artists.values()).filter((artist) =>
        favs.artists.includes(artist.id),
      ),
      albums: Array.from(albums.values()).filter((album) =>
        favs.albums.includes(album.id),
      ),
      tracks: Array.from(tracks.values()).filter((track) =>
        favs.tracks.includes(track.id),
      ),
    };
  }

  createTrack(id: string) {
    if (!tracks.has(id)) {
      throw new HttpException(
        `Track id "${id}" doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    favs.tracks.push(id);
    return {
      message: 'Track added to favorites',
    };
  }

  removeTrack(id: string, silent: boolean = false) {
    const index = favs.tracks.indexOf(id);
    if (index === -1 && !silent) {
      throw new NotFoundException(`Track id "${id}" is not in favorites`);
    }
    favs.tracks.splice(index, 1);
    return true;
  }

  createAlbum(id: string) {
    if (!albums.has(id)) {
      throw new HttpException(
        `Album id "${id}" doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    favs.albums.push(id);
    return {
      message: 'Album added to favorites',
    };
  }

  removeAlbum(id: string, silent: boolean = false) {
    const index = favs.albums.indexOf(id);
    if (index === -1 && !silent) {
      throw new NotFoundException(`Album id "${id}" is not in favorites`);
    }
    favs.albums.splice(index, 1);
    return true;
  }

  createArtist(id: string) {
    if (!artists.has(id)) {
      throw new HttpException(
        `Artist id "${id}" doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    favs.artists.push(id);
    return {
      message: 'Artist added to favorites',
    };
  }

  removeArtist(id: string, silent: boolean = false) {
    const index = favs.artists.indexOf(id);
    if (index === -1 && !silent) {
      throw new NotFoundException(`Artist id "${id}" is not in favorites`);
    }
    favs.artists.splice(index, 1);
    return true;
  }
}
