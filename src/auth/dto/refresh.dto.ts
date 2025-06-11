import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
