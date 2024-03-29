import { Logger } from '@nestjs/common';
import validator from 'validator';
import * as dgram from 'dgram';
import * as dnsPacket from 'dns-packet';

const logger = new Logger('EmailUtils');

export class EmailUtils {
  static isEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  }

  static async validateEmail(email): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!validator.isEmail(email)) {
        resolve(false);
      }

      const domain = email.split('@')[1];
      const packet = dnsPacket.encode({
        type: 'query',
        id: 1,
        flags: dnsPacket.RECURSION_DESIRED,
        questions: [
          {
            type: 'MX',
            name: domain,
          },
        ],
      });

      const socket = dgram.createSocket('udp4');

      socket.send(packet, 0, packet.length, 53, '8.8.8.8');

      socket.on('message', (message) => {
        const response = dnsPacket.decode(message);

        if (response.answers.some((answer) => answer.type === 'MX')) {
          resolve(true);
        } else {
          resolve(false);
        }

        socket.close();
      });
    });
  }

  static getSmtpDomain(host: string) {
    return host.split('.')[1];
  }
}
