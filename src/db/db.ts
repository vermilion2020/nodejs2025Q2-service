import { Artist } from 'src/artist/entities/artist.entity';
import { User } from '../user/entities/user.entity';
import { Album } from 'src/album/entities/album.entity';

export const users: Map<string, User> = new Map();

export const artists: Map<string, Artist> = new Map();

export const albums: Map<string, Album> = new Map();
