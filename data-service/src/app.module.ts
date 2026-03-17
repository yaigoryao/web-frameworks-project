import { Module, OnModuleInit } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Car, Order, OrderStatus, Role, User, UserCar } from '@monorepo/shared';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MapperService } from './services/mapper-service/mapper.service';
import { UserMapper } from './services/mapper-service/mapper-handlers/user.mapper'
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomersUserController } from './controllers/user/customer/customer-user.controller';
import { CarMapper } from './services/mapper-service/mapper-handlers/car.mapper';
import { OrderMapper } from './services/mapper-service/mapper-handlers/order.mapper';
import { OrderStatusMapper } from './services/mapper-service/mapper-handlers/order-status.mapper';
import { RoleMapper } from './services/mapper-service/mapper-handlers/role.mapper';
import { CustomerUserService } from './services/user-service/customers/customers-user.service';
import { IDataMapper } from './services/mapper-service/mapper-handlers/base.mapper';
import { AuthGuard } from './guards/auth-guard/auth.guard';
import { Dialect } from 'sequelize';
import { UserRepository } from './repositoires/user-repository/user.repository';
import { CustomerCarController } from './controllers/car/customer/customer-car.controller';
import { ManagersCarController } from './controllers/car/manager/manager-car.controller';
import { OwnerCarController } from './controllers/car/owner/owner-car.controller';
import { CustomerOrderController } from './controllers/order/customer/customer-order.controller';
import { ManagersOrderController } from './controllers/order/manager/manager-order.controller';
import { OwnerOrderController } from './controllers/order/owner/owner-order.controller';
import { ManagersUserController } from './controllers/user/manager/manager-user.controller';
import { OwnerUserController } from './controllers/user/owner/owner-user.controller';
import { CarRepository } from './repositoires/car-repository/car.repository';
import { OrderRepository } from './repositoires/order-repository/order.repository';
import { OrderStatusRepository } from './repositoires/order-status-repository/order-status.repository';
import { RoleRepository } from './repositoires/role-repository/role.repository';
import { CustomerCarService } from './services/car-service/customers/customers-car.service';
import { ManagersCarService } from './services/car-service/managers/managers-car.service';
import { OwnerCarService } from './services/car-service/owner/owner-car.service';
import { CustomerOrderService } from './services/order-service/customers/customers-order.service';
import { ManagersOrderService } from './services/order-service/managers/managers-order.service';
import { OwnerOrderService } from './services/order-service/owner/owner-order.service';
import { ManagersUserService } from './services/user-service/managers/managers-user.service';
import { OwnerUserService } from './services/user-service/owner/owner-user.service';
import { RolesGuard } from './guards/role-guard/role.guard';
import { OwnerGuard } from './guards/owner-guard/owner.guard';
import { DatabaseInitializerService } from './services/database-initializer/database-initializer.service';
//import { DataModel } from './models/data.model';

export const MAPPERS_TOKEN = 'ALL_MAPPERS_TOKEN';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: config.get<Dialect>('DB_DIALECT') || 'sqlite',
        storage: config.get<string>('DB_STORAGE') || 'temp.db',//=== 'sqlite' ? config.get('SQLITE_STORAGE') || ':memory:' : undefined,
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT') ? Number(config.get('DB_PORT')) : undefined,
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME') || 'app_db',
        models: [User, Role, UserCar, Car, Order, OrderStatus],
        autoLoadModels: true,
        synchronize: true
      })
    }),
    // SequelizeModule.forRoot({
    //   dialect: (process.env.DB_DIALECT as any) || 'sqlite',
    //   storage: process.env.DB_DIALECT === 'sqlite' ? (process.env.SQLITE_STORAGE || ':memory:') : undefined,
    //   host: process.env.DB_HOST,
    //   port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    //   username: process.env.DB_USER,
    //   password: process.env.DB_PASS,
    //   database: process.env.DB_NAME || 'data_db',
    //   models: [User, Role, UserCar, Car, Order, OrderStatus],
    //   autoLoadModels: true,
    //   synchronize: true
    // }),
    SequelizeModule.forFeature([User, Role, UserCar, Car, Order, OrderStatus]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        publicKey: config.get<string>('JWT_PUBLIC_KEY'),
        verifyOptions: { algorithms: ['RS256'] },
      }),
    }),
  ],
  controllers: [AppController, CustomersUserController, CustomerCarController, ManagersCarController, OwnerCarController, CustomerOrderController, ManagersOrderController, OwnerOrderController, ManagersUserController, OwnerUserController],
  providers: [AppService, MapperService, DatabaseInitializerService,
    CustomerUserService, CustomerCarService, ManagersCarService, OwnerCarService, CustomerOrderService, ManagersOrderService, OwnerOrderService, ManagersUserService, OwnerUserService,
    UserMapper, CarMapper, OrderMapper, OrderStatusMapper, RoleMapper,
    {
      provide: MAPPERS_TOKEN,
      useFactory: (...mappers: IDataMapper<any, any>[]) => mappers,
      inject: [UserMapper, CarMapper, OrderMapper, OrderStatusMapper, RoleMapper],
    },
    AuthGuard, RolesGuard, OwnerGuard, UserRepository, CarRepository, OrderRepository, OrderStatusRepository, RoleRepository
  ],
  exports: [MAPPERS_TOKEN]
})
export class AppModule implements OnModuleInit {
  constructor(private readonly databaseInitializer: DatabaseInitializerService) { }

  async onModuleInit(): Promise<void> {
    await this.databaseInitializer.initializeDatabase();
  }
}
