import { Module } from '@nestjs/common';
import { SeedingService } from './seeding.service';
import { Nodemailer } from 'src/modules/email/libs/mailers/nodemailer';

@Module({
  providers: [SeedingService, Nodemailer],
  exports: [Nodemailer],
})
export class SeedingModule {}
