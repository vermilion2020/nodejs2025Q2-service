import { IsNotEmpty, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsString()
  @IsOptional()
  artistId: string | null;
}
