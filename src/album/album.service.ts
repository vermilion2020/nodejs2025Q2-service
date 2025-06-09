import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseError } from 'src/utils/errors';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    try {
      const album = await this.prisma.album.create({
        data: createAlbumDto,
      });
      return album;
    } catch (error) {
      throw parseError(error);
    }
  }

  async findAll() {
    const albums = await this.prisma.album.findMany();
    return albums || [];
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException(`Album with id "${id}" not found`);
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException(`Album with id "${id}" not found`);
    }
    try {
      const updatedAlbum = await this.prisma.album.update({
        where: { id },
        data: updateAlbumDto,
      });
      return updatedAlbum;
    } catch (error) {
      throw parseError(error);
    }
  }

  async remove(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException(`Album with id "${id}" not found`);
    }
    await this.prisma.album.delete({
      where: { id },
    });
    return true;
  }
}
