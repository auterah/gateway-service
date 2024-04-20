/* eslint-disable class-methods-use-this */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const respObject = context.switchToHttp().getResponse();
        const response = {
          statusCode: respObject?.statusCode,
          status: 'Success',
          message: '',
          time: new Date().toISOString(),
          data,
        };

        if ('pagination' in data) {
          Object.assign(response, { meta: data.pagination });
          response.message = response.message || 'Records fetched successfully';
          delete data.pagination;
        }

        if (typeof response.data == 'string') {
          response.message = response.data;
          response.data = null;
        }

        return {
          ...response,
          request: {
            method: respObject?.req?.method,
            path: respObject?.req?.originalUrl,
          },
        };
      }),
    );
  }
}
