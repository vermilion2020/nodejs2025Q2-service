import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseError } from 'src/utils/errors';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto) {
    try {
      const artist = await this.prisma.artist.create({
        data: createArtistDto,
      });
      return artist;
    } catch (error) {
      throw parseError(error);
    }
  }

  async findAll() {
    const artists = await this.prisma.artist.findMany();
    return artists || [];
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!artist) {
      throw new NotFoundException(`Artist with id "${id}" not found`);
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!artist) {
      throw new NotFoundException(`Artist with id "${id}" not found`);
    }
    try {
      const updatedArtist = await this.prisma.artist.update({
        where: { id },
        data: updateArtistDto,
      });
      return updatedArtist;
    } catch (error) {
      throw parseError(error);
    }
  }

  async remove(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!artist) {
      throw new NotFoundException(`Artist with id "${id}" not found`);
    }
    await this.prisma.artist.delete({
      where: { id },
    });
    return true;
  }
}
