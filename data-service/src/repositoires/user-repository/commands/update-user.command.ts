import { Transform, Type } from 'class-transformer';
import { MinLength, ValidateIf, IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** `null` must stay null: `@Type(() => Number)` turns null into 0 and breaks FK updates. */
function nullishNumberTransform({ value }: { value: unknown }): number | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

function nullishStringTransform({ value }: { value: unknown }): string | null {
    if (value === null || value === undefined) {
        return null;
    }
    return String(value);
}

export class UpdateUserCommand {
    @ApiProperty({ description: 'User login', example: 'john_doe' })
    @IsString()
    @Type(() => String)
    login: string = '';

    @ApiPropertyOptional({ description: 'User password (if updating)', example: 'NewPassword123!', type: String, nullable: true })
    @IsOptional()
    @Transform(nullishStringTransform)
    @IsString()
    @ValidateIf((o) => o.password !== null && o.password !== undefined && String(o.password).trim() !== '')
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string | null = null;

    @ApiPropertyOptional({ description: 'User first name', minLength: 1, example: 'John', type: String, nullable: true })
    @IsOptional()
    @Transform(nullishStringTransform)
    @IsString()
    @ValidateIf((o) => o.name !== null && o.name !== undefined)
    @MinLength(1, { message: 'Name must not be empty' })
    name: string | null = null;

    @ApiPropertyOptional({ description: 'User last name', minLength: 1, example: 'Doe', type: String, nullable: true })
    @IsOptional()
    @Transform(nullishStringTransform)
    @IsString()
    @ValidateIf((o) => o.surname !== null && o.surname !== undefined)
    @MinLength(1, { message: 'Surname must not be empty' })
    surname: string | null = null;

    @ApiPropertyOptional({ description: 'User patronymic', type: String, nullable: true })
    @IsOptional()
    @Transform(nullishStringTransform)
    @IsString()
    @ValidateIf((o) => o.patronymic !== null && o.patronymic !== undefined)
    @MinLength(1, { message: 'Patronymic must not be empty when provided' })
    patronymic: string | null = null;

    @ApiPropertyOptional({ description: 'User is active', example: true, type: Boolean, nullable: true })
    @IsOptional()
    @Transform(({ value }) => (value === null || value === undefined ? null : Boolean(value)))
    @ValidateIf((_, v) => v !== null && v !== undefined)
    @IsBoolean()
    isActive: boolean | null = null;

    @ApiPropertyOptional({ description: 'User phone number', example: '+1234567890', type: String, nullable: true })
    @IsOptional()
    @Transform(nullishStringTransform)
    @IsString()
    phoneNumber: string | null = null;

    @ApiPropertyOptional({ description: 'User role ID', example: 1, type: Number, nullable: true })
    @IsOptional()
    @Transform(nullishNumberTransform)
    @ValidateIf((_, v) => v !== null && v !== undefined)
    @IsNumber()
    roleId: number | null = null;

    constructor(init?: Partial<UpdateUserCommand>) {
        Object.assign(this, init);
    }
}
