import App from 'src/modules/app/entities/app.entity';

export interface IAssigner {}

export type ParseHtml = {
  app: App;
  html: string;
};
