import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';
import { getEnumDescription } from './enum.utils';

export function ApiEnumResponse(enumObj: object, descriptionTitle: string, options?: ApiResponseOptions) {
    const enumValues = Object.values(enumObj).filter(v => typeof v === 'number');

    return applyDecorators(
        ApiResponse({
            ...options,
            status: options?.status || 200,
            schema: {
                type: 'integer',
                enum: enumValues,
                description: getEnumDescription(enumObj, descriptionTitle),
                example: enumValues[0] || 0,
            },
        }),
    );
}
