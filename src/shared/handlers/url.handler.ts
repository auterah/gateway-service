import { FindDataRequestDto } from '../utils/dtos/find.data.request.dto';

export class URLHandler {
  public static parseQueries(url: string, opts?: FindDataRequestDto) {
    if (!opts) return url;
    const optSize = Object.entries(opts).length;
    const optsHasManyQueries = optSize > 1;
    let count = 0;
    if (optSize) url += '?';
    for (const query in opts) {
      if (Object.prototype.hasOwnProperty.call(opts, query)) {
        const value = opts[query];
        url +=
          (optsHasManyQueries && !count) || !optsHasManyQueries
            ? `${query}=${value}`
            : `&${query}=${value}`;
      }
      count++;
    }
    return url;
  }
}
