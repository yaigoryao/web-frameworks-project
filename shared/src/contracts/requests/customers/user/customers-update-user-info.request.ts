import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerUpdateUserRequest {
    @ApiProperty({ description: 'User login', example: 'john_doe' })
    login!: string;

    @ApiPropertyOptional({ description: 'User first name', example: 'John' })
    name: string | null = null;

    @ApiPropertyOptional({ description: 'User password (if updating)', example: 'NewPassword123!' })
    password: string | null = null;

    @ApiPropertyOptional({ description: 'User last name', example: 'Doe' })
    surname: string | null = null;

    @ApiPropertyOptional({ description: 'User patronymic', example: 'Alexandrovich' })
    patronymic: string | null = null;

    @ApiPropertyOptional({ description: 'User phone number', example: '+1234567890' })
    phoneNumber: string | null = null;

    constructor(init?: Partial<CustomerUpdateUserRequest>) {
        Object.assign(this, init);
    }
}