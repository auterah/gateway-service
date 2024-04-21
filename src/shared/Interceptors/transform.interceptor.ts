/* eslint-disable class-methods-use-this */
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
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
        const response = context.switchToHttp().getResponse();
        // const request = context.switchToHttp().getRequest<Request>();

        const respData = {
          statusCode: response?.statusCode,
          status: 'Success',
          message: '',
          time: new Date().toISOString(),
          data,
        };

        if (data && data?.pagination) {
          Object.assign(respData, { meta: data.pagination });
          respData.message = respData.message || 'Records fetched successfully';
          delete data.pagination;
        }

        if (data && typeof data == 'string') {
          respData.message = respData.data;
          respData.data = null;
        }

        if (data && respData.statusCode == HttpStatus.CREATED) {
          respData.message = `Record(s) created successfully`;
        }

        return {
          ...respData,
          request: {
            method: response?.req?.method,
            path: response?.req?.originalUrl,
          },
        };
      }),
    );
  }
}
