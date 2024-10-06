import { NestFactory } from '@nestjs/core';
import { AppModule } from './bootstrap.module';
import { configs as appConfigs } from 'config/config.env';
import { IBootstrapConfigs } from './shared/interfaces/app_bootstrap';
import { ILogger } from './shared/interfaces/logger';
import { APP_LOGGER } from './shared/utils/Loggers';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import { LoggingInterceptor } from './shared/Interceptors/logging.interceptor';
import { TransformInterceptor } from './shared/Interceptors/transform.interceptor';
import { AvailableRoute } from './shared/types/app_bootstrap';
import { AllExceptionsFilter } from './shared/filters/exception_filter';

export class Bootstrap {
  protected serverName: string;
  protected serverPort: number;
  private static routeList: AvailableRoute[] = [];
  protected routesToExclude: string[];

  private logger: ILogger;

  constructor(private configs: IBootstrapConfigs) {
    this.serverName = this.configs.serverName;
    this.serverPort = this.configs.serverPort;
    this.routesToExclude = this.configs.routesToExclude;
    this.logger = new APP_LOGGER(
      this.configs.logger?.provider || 'DEFAULT',
    ).logger();
  }

  async init(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const PORT = appConfigs.SERVER_PORT;
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());

    app.setGlobalPrefix(appConfigs.API_VERSION, {
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
    Bootstrap.routeStore.save(availableRoutes);
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

  static get routeStore() {
    return {
      save(routes: AvailableRoute[]) {
        Bootstrap.routeList.push(...routes);
      },
      get() {
        return Bootstrap.routeList;
      },
      clear() {
        Bootstrap.routeList = [];
      },
    };
  }
}
