import { CryptoUtil } from 'src/shared/utils/crypto';
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

  static removeDuplicatesIdentifiers(
    tagIdentifiers: ClientTag[],
    field = 'id',
  ): ClientTag[] {
    return tagIdentifiers.filter(
      (value, index, array) =>
        index ===
        array.findIndex((item) => {
          const identifier = !CryptoUtil.isUUID(item[field]) ? 'name' : 'id';
          return item[identifier] === value[identifier];
        }),
    );
  }
}
