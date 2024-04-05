import { configs } from 'config/config.env';
import { Bootstrap } from './bootstrap';

const app = new Bootstrap({
  serverPort: configs.SERVER_PORT,
  serverName: configs.SERVER_NAME,
  routesToExclude: [
    'auth',
    'auth/register',
    'auth/customer-x-token',
    'auth/2',
    'auth/2/verify-otp',
    'auth/me',
    'auth/admin',
    'app/init',
    'auth/admin/verify-otp',
    'admins/(.*)',
  ],
  logger: {
    // Logger should be setup in a SINGLETON manner. It should be accessible to all services, controllers, modules.
    provider: 'PINO',
  },
});

app.init();
