/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { connect, MqttClient } from 'mqtt';
import { MqttUtils } from './utils/mqtt';
import { AesEncryption } from 'src/shared/utils/encryption';
import { MQTTPayload } from 'src/shared/interfaces/mqtt';
import { configs } from 'config/config.env';
import { MailEvents } from 'src/shared/events/mail.events';
import { MQTT_TOPICS } from 'src/shared/enums';

@Injectable()
export class MqttService implements OnModuleInit {
  private mqttClient: MqttClient;
  private readonly host: string;
  private readonly port: number;
  private readonly username: string;
  private readonly password: string;
  private readonly clientId: string;
  private readonly defaultTopic: string;
  private subscribedTopics: string[] = [];
  private encryption: AesEncryption;
  private logger: Logger;

  constructor(private event: EventEmitter2) {
    this.logger = new Logger(this.constructor.name);
    this.host = process.env.MQTT_HOST;
    this.port = 1883;
    this.username = process.env.MQTT_USER;
    this.password = process.env.MQTT_PASSWORD;
    this.clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    this.defaultTopic = '';
    this.encryption = new AesEncryption(configs.ENCRYPTION_PRIVATE_KEY);
  }

  async onModuleInit() {
    const topic = MqttUtils.getTopicsBasedOnEnv(MQTT_TOPICS.EMAIL);
    await this.connectToMqtt();
    this.subscribe(topic);
    this.subscribe(MailEvents.QUEUE_MAIL);
    this.listenToTopics();
  }

  private async connectToMqtt() {
    const connectUrl = `mqtt://${this.host}:${this.port}`;

    try {
      this.mqttClient = connect(connectUrl, {
        clientId: this.clientId,
        clean: true,
        connectTimeout: 4000,
        username: this.username,
        password: this.password,
        reconnectPeriod: 1000,
      });

      await new Promise<void>((resolve, reject) => {
        this.mqttClient.on('connect', () => {
          console.log('Connected to CloudMQTT');
          resolve();
        });

        this.mqttClient.on('error', (error) => {
          console.error('Error in connecting to CloudMQTT:', error.message);
          reject(error);
        });
      });
    } catch (error) {
      console.error('Failed to connect to CloudMQTT:', error.message);
    }
  }

  async publish(topic: string, payload: string): Promise<void> {
    if (!this.mqttClient || !this.mqttClient.connected) {
      throw new Error('MQTT client is not connected.');
    }

    try {
      console.log(`Publishing to ${topic}`);
      console.log(MqttUtils.getTopicsBasedOnEnv(topic));

      const ecryptedData = this.encryption.encrypt(payload);

      this.mqttClient.publish(
        MqttUtils.getTopicsBasedOnEnv(topic),
        ecryptedData,
      );
    } catch (error) {
      console.error('Failed to publish message:', error.message);
      throw error;
    }
  }

  async publishToMultipleTopics(
    topics: string[],
    payload: string,
  ): Promise<void> {
    if (!this.mqttClient || !this.mqttClient.connected) {
      throw new Error('MQTT client is not connected.');
    }

    try {
      const publishPromises = topics.map((topic) => {
        console.log(`Publishing to ${topic}: ${payload}`);
        return new Promise<void>((resolve, reject) => {
          this.mqttClient.publish(topic, payload, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });

      await Promise.all(publishPromises);
    } catch (error) {
      console.error('Failed to publish to multiple topics:', error.message);
      throw error;
    }
  }

  subscribe(topic: string): void {
    if (!this.subscribedTopics.includes(topic)) {
      this.subscribedTopics.push(topic);
      this.mqttClient.subscribe(topic);
      this.logger.log(`Subscribed to topic: ${topic}`);
    }
  }

  private listenToTopics(): void {
    if (!this.mqttClient || !this.mqttClient.connected) {
      throw new Error('MQTT client is not connected.');
    }

    this.mqttClient.on('message', (topic, message) => {
      const buffStr = Buffer.from(message).toString();
      const decryptData = this.encryption.decrypt(buffStr);

      const payload: MQTTPayload = { topic, message: JSON.parse(decryptData) };

      console.log(`Received message on topic ${topic}: ${message}`);
      // Process incoming messages based on the topic
      // Your message processing logic here...
    });

    // Automatically subscribe to the default topic on connection
    // this.subscribe(this.defaultTopic);
  }

  // @OnEvent(MailEvents.QUEUE_MAIL)
  private mailListener(mailPayload: any): void {
    const ecryptedData = this.encryption.encrypt(JSON.stringify(mailPayload));
    this.mqttClient.publish(MailEvents.QUEUE_MAIL, ecryptedData);
  }
}
