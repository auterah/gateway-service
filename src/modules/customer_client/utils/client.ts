import Client from '../client.entity';

export class ClientUtils {
  static removeDuplicatesByEmail(clients: Client[]): Client[] {
    return clients.filter(
      (value, index, array) =>
        index === array.findIndex((item) => item.email === value.email),
    );
  }
}
