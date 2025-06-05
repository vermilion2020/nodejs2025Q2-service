import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FavsService } from 'src/favs/favs.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseError } from 'src/utils/errors';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
    private readonly prisma: PrismaService,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    try {
      const track = await this.prisma.track.create({
        data: createTrackDto,
      });
      return track;
    } catch (error) {
      throw parseError(error);
    }
  }

  async findAll() {
    const tracks = await this.prisma.track.findMany();
    return tracks || [];
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });
    if (!track) {
      throw new NotFoundException(`Track with id "${id}" not found`);
    }
    return track;
  }

  async setNullArtist(id: string) {
    await this.prisma.track.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });
  }

  async setNullAlbum(id: string) {
    await this.prisma.track.updateMany({
      where: { albumId: id },
      data: { albumId: null },
    });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    await this.findOne(id);
    try {
      const updatedTrack = await this.prisma.track.update({
        where: { id },
        data: updateTrackDto,
      });
      return updatedTrack;
    } catch (error) {
      throw parseError(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      // this.favsService.removeTrack(id, true);
      await this.prisma.track.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      throw parseError(error);
    }
  }
}
