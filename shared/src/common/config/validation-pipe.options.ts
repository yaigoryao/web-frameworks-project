import { ValidationPipeOptions } from '@nestjs/common';

export function getValidationPipeOptions(): ValidationPipeOptions {
    return {
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
            exposeDefaultValues: true,
        },
        whitelist: true,
        forbidNonWhitelisted: false,
        forbidUnknownValues: false,
    } as ValidationPipeOptions;
}