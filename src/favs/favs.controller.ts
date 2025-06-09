import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { StatusCodes } from 'http-status-codes';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('favs')
@ApiTags('Favorites')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorites' })
  findAll() {
    return this.favsService.findAll();
  }

  @Post('track/:id')
  @ApiOperation({ summary: 'Create track in favorites' })
  createTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.createTrack(id);
  }

  @Delete('track/:id')
  @ApiOperation({ summary: 'Remove track from favorites' })
  @HttpCode(StatusCodes.NO_CONTENT)
  removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.removeTrack(id);
  }

  @Post('album/:id')
  @ApiOperation({ summary: 'Create album in favorites' })
  createAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.createAlbum(id);
  }

  @Delete('album/:id')
  @ApiOperation({ summary: 'Remove album from favorites' })
  @HttpCode(StatusCodes.NO_CONTENT)
  removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.removeAlbum(id);
  }

  @Post('artist/:id')
  @ApiOperation({ summary: 'Create artist in favorites' })
  createArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.createArtist(id);
  }

  @Delete('artist/:id')
  @ApiOperation({ summary: 'Remove artist from favorites' })
  @HttpCode(StatusCodes.NO_CONTENT)
  removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.removeArtist(id);
  }
}
