import { MQTT_TOPICS } from 'src/shared/enums';

export type MQTTPayload = {
  topic: string;
  message: string;
};

export type MailContentTypes = 'text/plain' | 'application/pdf' | 'image/gif';
export type MqttMailPayload = { email: string; data: any };

export type MQTTTopics = keyof typeof MQTT_TOPICS;
export type MailPayload = {
  email: string;
  html: string;
  subject: string;
  subText?: string;
};
