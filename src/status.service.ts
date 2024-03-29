import { Injectable } from '@nestjs/common';

@Injectable()
export class StatusService {
  exeHealthTalk(): string {
    return 'Server is up!';
  }
}
