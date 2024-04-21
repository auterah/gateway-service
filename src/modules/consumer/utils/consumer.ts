import Consumer from '../consumer.entity';

export class ConsumerUtils {
  static removeDuplicatesByEmail(consumers: Consumer[]): Consumer[] {
    return consumers.filter(
      (value, index, array) =>
        index === array.findIndex((item) => item.email === value.email),
    );
  }
}
