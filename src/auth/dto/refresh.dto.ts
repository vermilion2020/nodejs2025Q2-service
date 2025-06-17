import { IsOptional } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @IsNotEmpty()
  @IsOptional()
  refreshToken?: string;
}
