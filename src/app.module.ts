import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentModule } from './modules/document/document.module';
import baseConfig from './config/baseConfig';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { IngestionModule } from './modules/ingestion/ingestion.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('databaseUrl'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
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
    IngestionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClsMiddleware).forRoutes('*', {
      path: '*/document/:splat*/*',
      method: RequestMethod.ALL,
    });
  }
}
