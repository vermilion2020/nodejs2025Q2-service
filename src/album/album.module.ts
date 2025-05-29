import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { FavsModule } from 'src/favs/favs.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  imports: [FavsModule],
})
export class AlbumModule {}
