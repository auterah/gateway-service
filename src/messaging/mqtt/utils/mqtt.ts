import { configs } from 'config/config.env';
import { Environment, isProduction, isStaging } from 'src/shared/utils/environment';

export class MqttUtils {
  static getTopicsBasedOnEnv(initiator: string): string {
    let topic = `${configs.SERVER_NAME}.${Environment.development}.${initiator}`;

    if (isProduction()) {
      topic = `${configs.SERVER_NAME}.${Environment.production}.${initiator}`;
    }
    if (isStaging()) {
      topic = `${configs.SERVER_NAME}.${Environment.staging}.${initiator}`;
    }

    return topic;
  }
}
