import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { User, Role, OrderStatus } from '@monorepo/shared';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

@Injectable()
export class DatabaseInitializerService {
    private readonly logger = new Logger(DatabaseInitializerService.name);

    constructor(
        @InjectModel(Role) private readonly roleModel: typeof Role,
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(OrderStatus) private readonly orderStatusModel: typeof OrderStatus,
        private readonly configService: ConfigService
    ) { }

    async initializeDatabase(): Promise<void> {
        try {
            await this.createRoles();

            await this.createOwnerAccount();

            await this.createOrderStatuses();
            this.logger.log('Database initialization completed successfully');
        }
        catch (error) {
            this.logger.error('Database initialization failed:', error);
            throw error;
        }
    }

    private async createRoles(): Promise<void> {
        const roleNames = ['user', 'manager', 'owner'];

        for (const roleName of roleNames) {
            const existingRole = await this.roleModel.findOne({ where: { roleName } });
            if (!existingRole) {
                await this.roleModel.create({ roleName } as Role);
                this.logger.log(`Created role: ${roleName}`);
            }
        }
    }

    private async createOwnerAccount(): Promise<void> {
        const ownerLogin = this.configService.get<string>('OWNER_LOGIN');

        const existingOwner = await this.userModel.findOne({ where: { login: ownerLogin } });
        if (existingOwner) {
            //this.logger.log(`Owner account '${ownerLogin}' already exists`);
            return;
        }

        const ownerRole = await this.roleModel.findOne({ where: { roleName: 'owner' } });
        if (!ownerRole) {
            //this.logger.error('Owner role not found');
            return;
        }

        const ownerPassword = this.configService.get<string>('OWNER_PASSWORD');
        const ownerName = this.configService.get<string>('OWNER_NAME') || 'Admin';
        const ownerSurname = this.configService.get<string>('OWNER_SURNAME') || 'User';
        const ownerPhone = this.configService.get<string>('OWNER_PHONE') || '+0000000000';

        const salt = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(`${ownerPassword}${salt}`, 10);

        const owner = this.userModel.build({
            login: ownerLogin,
            password: hashedPassword,
            salt: salt,
            refreshToken: crypto.randomUUID(),
            name: ownerName,
            surname: ownerSurname,
            patronymic: null,
            phoneNumber: ownerPhone,
            isActive: true,
            roleId: ownerRole.id
        } as any);

        await owner.save();
        //this.logger.log(`Created owner account: ${ownerLogin}`);
    }

    private async createOrderStatuses(): Promise<void> {
        const ordersStatuses = ['in_process', 'completed', 'cancelled', 'pending', 'deleted', 'waiting_car'];

        for (const status of ordersStatuses) {
            const existingRole = await this.orderStatusModel.findOne({ where: { orderStatusName: status } });
            if (!existingRole) {
                await this.orderStatusModel.create({ orderStatusName: status } as OrderStatus);
            }
        }
    }
}
