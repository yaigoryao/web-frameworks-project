import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@monorepo/shared';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataModel } from './models/data.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: (process.env.DB_DIALECT as any) || 'sqlite',
      storage: process.env.DB_DIALECT === 'sqlite' ? (process.env.SQLITE_STORAGE || ':memory:') : undefined,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME || 'data_db',
      models: [User, DataModel],
      autoLoadModels: true,
      synchronize: true
    }),
    SequelizeModule.forFeature([User, DataModel])
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
