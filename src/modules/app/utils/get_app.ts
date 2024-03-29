import { CurrentApp } from 'src/shared/types/request';
import App from '../entities/app.entity';

export default function (req: CurrentApp): App {
  return req.currentApp;
}
