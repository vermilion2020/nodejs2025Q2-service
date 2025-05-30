import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { FavsModule } from 'src/favs/favs.module';
import { AlbumModule } from 'src/album/album.module';
import { TrackModule } from 'src/track/track.module';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  imports: [FavsModule, AlbumModule, TrackModule],
})
export class ArtistModule {}
