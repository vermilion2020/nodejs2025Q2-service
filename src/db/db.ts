import { Artist } from 'src/artist/entities/artist.entity';
import { User } from '../user/entities/user.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { Favs } from 'src/favs/entities/favs.entity';

export const users: Map<string, User> = new Map();

export const artists: Artist[] = [];

export const albums: Album[] = [];

export const tracks: Track[] = [];

export const favs: Favs = {
  artists: [],
  albums: [],
  tracks: [],
};
