import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export function getCorsOptions(originRaw: string[] | string | undefined | null): CorsOptions {
    let origin: string[] | string = originRaw ?? 'http://localhost:5000';

    if (typeof origin === 'string' && origin.includes(',')) {
        origin = origin.split(',').map(addr => addr.trim());
    }

    return {
        origin:"*",
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS', 'TRACE', 'CONNECT'],
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
            'Origin',
            'User-Agent',
            'Cache-Control',
            'Pragma',
            'Expires',
            'X-Forwarded-For',
            'X-Forwarded-Proto',
            'X-Real-IP',
            'X-CSRF-Token',
            'X-XSRF-TOKEN',
            'Sentry-Trace',
            'Baggage',
            'Range',
            'If-Range',
            'If-Match',
            'If-None-Match',
            'If-Modified-Since',
            'If-Unmodified-Since',
            'Access-Control-Request-Method',
            'Access-Control-Request-Headers',
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Credentials',
            'Access-Control-Allow-Methods',
            'Access-Control-Allow-Headers',
            'Access-Control-Expose-Headers',
            'X-Custom-Header',
        ],

        exposedHeaders: [
            'Content-Range',
            'X-Content-Range',
            'Content-Length',
            'Content-Type',
            'Authorization',
            'Set-Cookie',
            'X-Total-Count',
            'X-Pagination-Total',
            'X-Pagination-Page',
            'X-Pagination-Limit',
            'X-Request-Id',
            'X-Response-Time',
            'Server',
            'X-Powered-By',
            'ETag',
            'Last-Modified',
            'Location',
            'Link',
            'Retry-After',
            'X-RateLimit-Limit',
            'X-RateLimit-Remaining',
            'X-RateLimit-Reset',
        ],

        maxAge: 86400,

        preflightContinue: false,

        optionsSuccessStatus: 204,
    };
}