import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { body, query } = request;

        // Здесь можно добавить логику для преобразования body и query
        // В зависимости от маршрута, применяйте нужный класс

        return next.handle();
    }
}
