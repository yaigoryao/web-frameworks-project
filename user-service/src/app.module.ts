import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Car, Order, OrderStatus, Role, User, UserCar } from '@monorepo/shared';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import  { ConfigModule, ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';
import { LoginController } from './controllers/login/login.controller';
import { AuthService } from './services/auth-service/auth.service';
import { RegisterController } from './controllers/register/register.controller';
import { RefreshController } from './controllers/refresh/refresh.controller';

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
    })}),
    SequelizeModule.forFeature([User, Role, UserCar, Car, Order, OrderStatus])
  ],
  controllers: [AppController, LoginController, RegisterController, RefreshController],
  providers: [AppService, AuthService]
})
export class AppModule {}
