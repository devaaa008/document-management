import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DocumentModule } from './modules/document/document.module';
import baseConfig from './config/baseConfig';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'temp1234',
      database: 'document-management',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [baseConfig],
      isGlobal: true,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: false },
    }),
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClsMiddleware).forRoutes('*', {
      path: '*/document/:splat*/*',
      method: RequestMethod.ALL,
    });
  }
}
