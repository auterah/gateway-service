import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configs } from 'config/config.env';
import { IBootstrapConfigs } from './shared/interfaces/app_bootstrap';
import { ILogger } from './shared/interfaces/logger';
import { APP_LOGGER } from './shared/utils/Loggers';
import { LoggingInterceptor } from './global/Interceptors/logging.interceptor';
import { TransformInterceptor } from './global/Interceptors/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

export class Bootstrap {
  protected serverName: string;
  protected serverPort: number;
  protected routesToExclude: string[];

  private logger: ILogger;

  constructor(configs: IBootstrapConfigs) {
    this.serverName = configs.serverName;
    this.serverPort = configs.serverPort;
    this.routesToExclude = configs.routesToExclude;
    this.logger = new APP_LOGGER(
      configs.logger?.provider || 'DEFAULT',
    ).logger();
  }

  async init(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const PORT = configs.SERVER_PORT;
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.setGlobalPrefix(configs.API_VERSION, {
      exclude: this.routesToExclude,
    });

    app.use(json({ limit: '400000mb' }));

    app.enableCors({
      allowedHeaders: '*',
      origin: '*',
    });
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () => {
        this.logger.log(`${this.serverName} is up on port ${this.serverPort}`);
      }
    );
  }
}
