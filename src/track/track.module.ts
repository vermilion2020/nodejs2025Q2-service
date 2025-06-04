import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { FavsModule } from 'src/favs/favs.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  imports: [FavsModule, PrismaModule],
  exports: [TrackService],
})
export class TrackModule {}
