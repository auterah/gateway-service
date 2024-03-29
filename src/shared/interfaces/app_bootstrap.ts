import { ILogger, LoggerProviders } from './logger';

export interface IBootstrapConfigs {
  serverPort: number;
  serverName: string;
  logger?: { provider: LoggerProviders; use?: ILogger };
  routesToExclude: string[];
}
