import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { existsSync, readFile } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

const ReadFile = promisify(readFile);

@Injectable()
export class FsService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(FsService.name);
  }

  static writeFile(
    path: string,
    data: any,
    createFile = false,
  ): Promise<string> {
    let filePath = path;

    if (createFile && !existsSync(path)) {
      filePath = resolve(path);
    }

    return new Promise((resolve, reject) => {
      fs.writeFile(
        filePath,
        JSON.stringify(data, null, 2),
        'utf-8',
        function (err) {
          if (err) throw err;
          console.log(`Data saved to "${path}" file`);
          resolve('done');
        },
      );
    });
  }

  writeFile(path: string, data: any, createFile = false) {
    return FsService.writeFile(path, data, createFile);
  }

  readFile(path: string) {
    return FsService.readFile(path);
  }

  static readFile(filePath: string): Promise<string> {
    const resolvedPath = resolve(filePath);
    // return Promise.resolve(resolvedPath);
    return new Promise((resolve, reject) => {
      fs.readFile(resolvedPath, 'ascii', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  readImg(filePath: string): Promise<string> {
    const resolvedPath = resolve(filePath);
    // return Promise.resolve(resolvedPath);
    return new Promise((resolve, reject) => {
      // Read the image file as a buffer
      const buffer = fs.readFileSync(resolvedPath);

      // Convert the buffer to base64 format
      const base64 = Buffer.from(buffer).toString('base64');

      // Write the buffer data to a file
      // fs.writeFileSync(resolvedPath, buffer);

      // Convert base64 data back to an image file
      return Buffer.from(base64, 'base64');
    });
  }

  isHtml(str): boolean {
    const htmlRegEx = /<\/?[a-z][\s\S]*>/i;
    return htmlRegEx.test(str);
  }
}
