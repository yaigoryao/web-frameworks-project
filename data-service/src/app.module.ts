import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Car, Order, OrderStatus, Role, User, UserCar } from '@monorepo/shared';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MapperService } from './services/mapper-service/mapper.service';
import { UserMapper } from './services/mapper-service/mapper-handlers/user.mapper'
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomersUserController } from './controllers/user/user.controller';
import { CarMapper } from './services/mapper-service/mapper-handlers/car.mapper';
import { OrderMapper } from './services/mapper-service/mapper-handlers/order.mapper';
import { OrderStatusMapper } from './services/mapper-service/mapper-handlers/order-status.mapper';
import { RoleMapper } from './services/mapper-service/mapper-handlers/role.mapper';
import { UserService } from './services/user-service/customers/customers-user-service';
import { IDataMapper } from './services/mapper-service/mapper-handlers/base.mapper';
import { AuthGuard } from './guards/auth-guard/auth.guard';
//import { DataModel } from './models/data.model';

export const MAPPERS_TOKEN = 'ALL_MAPPERS_TOKEN';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    SequelizeModule.forRoot({
      dialect: (process.env.DB_DIALECT as any) || 'sqlite',
      storage: process.env.DB_DIALECT === 'sqlite' ? (process.env.SQLITE_STORAGE || ':memory:') : undefined,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME || 'data_db',
      models: [User, Role, UserCar, Car, Order, OrderStatus],
      autoLoadModels: true,
      synchronize: true
    }),
    SequelizeModule.forFeature([User, Role, UserCar, Car, Order, OrderStatus]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        publicKey: config.get<string>('JWT_PUBLIC_KEY'),
        verifyOptions: { algorithms: ['RS256'] },
      }),
    }),
  ],
  controllers: [AppController, CustomersUserController],
  providers: [AppService, MapperService,
    UserService, UserMapper, CarMapper, OrderMapper, OrderStatusMapper, RoleMapper,
    {
      provide: MAPPERS_TOKEN,
      useFactory: (...mappers: IDataMapper<any, any>[]) => mappers,
      inject: [UserMapper, CarMapper, OrderMapper, OrderStatusMapper, RoleMapper],
    },
    AuthGuard
  ],
  exports: [MAPPERS_TOKEN]
})
export class AppModule { }
