import { configs } from 'config/config.env';
import { Bootstrap } from './bootstrap';

console.log('Main.js called');

const app = new Bootstrap({
  serverPort: configs.SERVER_PORT,
  serverName: configs.SERVER_NAME,
  routesToExclude: [
    'auth',
    'auth/register',
    'auth/customer-x-token',
    'auth/2',
    'sessions/(.*)',
    'auth/2/sign-in',
    'auth/me',
    'auth/admin',
    'app/init',
    'auth/admin/verify-otp',
    'admins/(.*)',
    'add-smtp',
    'billings/(.*)',
    'currencies/(.*)',
    'regions/(.*)',
  ],
  logger: {
    // Logger should be setup in a SINGLETON manner. It should be accessible to all services, controllers, modules.
    provider: 'PINO',
  },
});

//debug

app.init();
