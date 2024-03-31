import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { readFileSync, writeFile, writeFileSync } from 'fs';
import { BootEvents } from './shared/events/local.events';
import { exec, execSync } from 'child_process';
import { seedDatabase } from './shared/constants/boot';

@Injectable()
export class BootService {
  constructor(private bootEvents: EventEmitter2) {}
  exeHealthTalk(): string {
    return 'Server is up!';
  }

  @OnEvent(BootEvents.INIT_APP)
  async boot() {
    const [seederResponse] = await this.bootEvents.emitAsync(
      BootEvents.SEED_DATABASE,
      seedDatabase,
    );
  }

  runDBMigration() {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    const command = `npx run ${packageJson.scripts['migration:run']}`;

    try {
      const output = execSync(command, { encoding: 'utf-8' });
      console.log('Command output:', output);
    } catch (error) {
      console.error('Error executing command:', error);
    }
  }
}
