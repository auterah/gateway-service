import { NestFactory } from '@nestjs/core';
import { AppModule } from './bootstrap.module';
import { configs } from 'config/config.env';
import { IBootstrapConfigs } from './shared/interfaces/app_bootstrap';
import { ILogger } from './shared/interfaces/logger';
import { APP_LOGGER } from './shared/utils/Loggers';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { LoggingInterceptor } from './shared/Interceptors/logging.interceptor';
import { TransformInterceptor } from './shared/Interceptors/transform.interceptor';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BootEvents } from './shared/events/local.events';
import { AvailableRoute } from './shared/types/app_bootstrap';
import { FsService } from './modules/file/file.service';

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
      origin: '*', // Todo: Make sure to block unrecognized requester.
    });
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () => {
      this.logger.log(`${this.serverName} is up on port ${this.serverPort}`);
    });
    const availableRoutes = this.getAvailableRoutes(app);
    this.memorizeAvailableRoutes(availableRoutes);
  }

  getAvailableRoutes(app) {
    const server = app.getHttpServer();
    const router = server._events.request._router;
    const availableRoutes: AvailableRoute[] = router.stack
      .map((layer) => {
        if (layer.route) {
          return {
            route: {
              path: layer.route?.path,
              method: layer.route?.stack[0].method,
            },
          };
        }
      })
      .filter((item) => item !== undefined);
    return availableRoutes;
  }

  memorizeAvailableRoutes(routes: AvailableRoute[]) {
    FsService.writeFile('targets.json', routes, true);
  }
}
