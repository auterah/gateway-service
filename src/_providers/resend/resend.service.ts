import { Injectable, Logger } from '@nestjs/common';
import { configs } from 'config/config.env';
import { Resend } from 'resend';

@Injectable()
export class ResendService {
  protected _logger = new Logger(ResendService.name);
  protected _exe: Resend;

  constructor() {
    this._init();
  }

  private async _init() {
    try {
      this._exe = new Resend(configs.RESEND_API_KEY);
    } catch (error) {
      throw error;
    }
  }
}
