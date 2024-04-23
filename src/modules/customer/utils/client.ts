import Client from '../entities/client.entity';
import ClientTag from '../entities/client_tag.entity';

export class ClientUtils {
  static removeDuplicatesByEmail(clients: Client[]): Client[] {
    return clients.filter(
      (value, index, array) =>
        index === array.findIndex((item) => item.email === value.email),
    );
  }
}

export class ClientTagUtils {
  static removeDuplicatesByName(tags: ClientTag[]): ClientTag[] {
    return tags.filter(
      (value, index, array) =>
        index === array.findIndex((item) => item.name === value.name),
    );
  }
}
