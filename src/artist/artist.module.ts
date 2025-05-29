import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { FavsModule } from 'src/favs/favs.module';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  imports: [FavsModule],
})
export class ArtistModule {}
