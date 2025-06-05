import { BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export enum ErrorMessages {
  FOREIGN_KEY_CONSTRAINT_VIOLATED = 'Foreign key constraint violated on one of the fields: ArtistId, AlbumId, TrackId',
}

export const parseError = (error: PrismaClientKnownRequestError) => {
  console.log(error);
  switch (error.code) {
    case 'P2003':
      return new BadRequestException(
        ErrorMessages.FOREIGN_KEY_CONSTRAINT_VIOLATED,
      );
    default:
      return new BadRequestException(error.message);
  }
};
