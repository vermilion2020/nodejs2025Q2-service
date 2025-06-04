import { BadRequestException } from '@nestjs/common';

export enum ErrorMessages {
  FOREIGN_KEY_CONSTRAINT_VIOLATED = 'Foreign key constraint violated on the (not available)',
}

export const parseError = (error: { message: string }) => {
  if (error.message.includes(ErrorMessages.FOREIGN_KEY_CONSTRAINT_VIOLATED)) {
    return new BadRequestException(
      ErrorMessages.FOREIGN_KEY_CONSTRAINT_VIOLATED,
    );
  }
  return new BadRequestException(error.message);
};
