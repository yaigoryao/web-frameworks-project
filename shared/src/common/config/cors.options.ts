import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export function getCorsOptions(originRaw: string[] | string | undefined | null): CorsOptions {
    let origin: string[] | string = originRaw ?? 'http://localhost:5000';

    if (typeof origin === 'string' && origin.includes(',')) {
        origin = origin.split(',').map(addr => addr.trim());
    }

    return {
        origin,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
            'Origin',
            'User-Agent',
            'Cache-Control',
            'X-Custom-Header',
        ],
    };
}