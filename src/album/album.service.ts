import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { FavsService } from 'src/favs/favs.service';
import { TrackService } from 'src/track/track.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseError } from 'src/utils/errors';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    private readonly prisma: PrismaService,
  ) {}

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

  async setNullArtist(id: string) {
    await this.prisma.album.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });
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
    // this.favsService.removeAlbum(id, true);
    await this.prisma.album.delete({
      where: { id },
    });
    return true;
  }
}
