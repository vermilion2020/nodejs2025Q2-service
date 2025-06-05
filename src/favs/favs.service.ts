import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.favorites.findMany({
      where: {
        OR: [
          { artistId: { not: null } },
          { albumId: { not: null } },
          { trackId: { not: null } },
        ],
      },
      include: {
        artist: true,
        album: true,
        track: true,
      },
    });
    return {
      artists: data
        .filter((item) => item.artistId)
        .map((artist) => artist.artist),
      albums: data.filter((item) => item.albumId).map((album) => album.album),
      tracks: data.filter((item) => item.trackId).map((track) => track.track),
    };
  }

  async createTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });
    if (!track) {
      throw new HttpException(
        `Track id "${id}" doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.prisma.favorites.create({
      data: {
        trackId: id,
      },
    });
    return {
      message: 'Track added to favorites',
    };
  }

  async removeTrack(id: string) {
    const favorite = await this.prisma.favorites.findFirst({
      where: { trackId: id },
    });
    if (!favorite) {
      throw new NotFoundException(`Track id "${id}" is not in favorites`);
    }
    await this.prisma.favorites.delete({
      where: { id: favorite.id },
    });
    return;
  }

  async createAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new HttpException(
        `Track id "${id}" doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.prisma.favorites.create({
      data: {
        albumId: id,
      },
    });
    return {
      message: 'Album added to favorites',
    };
  }

  async removeAlbum(id: string) {
    const favorite = await this.prisma.favorites.findFirst({
      where: { albumId: id },
    });
    if (!favorite) {
      throw new NotFoundException(`Album id "${id}" is not in favorites`);
    }
    await this.prisma.favorites.delete({
      where: { id: favorite.id },
    });
    return;
  }

  async createArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!artist) {
      throw new HttpException(
        `Artist id "${id}" doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.prisma.favorites.create({
      data: {
        artistId: id,
      },
    });
    return {
      message: 'Artist added to favorites',
    };
  }

  async removeArtist(id: string) {
    const favorite = await this.prisma.favorites.findFirst({
      where: { artistId: id },
    });
    if (!favorite) {
      throw new NotFoundException(`Artist id "${id}" is not in favorites`);
    }
    await this.prisma.favorites.delete({
      where: { id: favorite.id },
    });
    return;
  }
}
