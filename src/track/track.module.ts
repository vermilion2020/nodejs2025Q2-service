import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { FavsModule } from 'src/favs/favs.module';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  imports: [FavsModule],
  exports: [TrackService],
})
export class TrackModule {}
