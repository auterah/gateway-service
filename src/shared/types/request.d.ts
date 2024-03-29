import { Request } from 'express';
import App from 'src/modules/app/entities/app.entity';

export type CurrentApp = Request & { currentApp: App };
