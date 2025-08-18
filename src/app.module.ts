import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanApplication } from './entities/loan-application.entity';
import { BusinessRule } from './entities/business-rule.entity';
import { RuleHistory } from './entities/rule-history.entity';
import { RuleEngineService } from './rules/rule-engine.service';
import { AdminApiKeyGuard, ApiKeyGuard } from './common/guards/api-key.guard';
import { LoggerModule } from 'nestjs-pino';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoanModule } from './loan/loan.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.user'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.name'),
        ssl: config.get<boolean>('database.ssl')
          ? { rejectUnauthorized: false }
          : false,
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([LoanApplication, BusinessRule, RuleHistory]),
    LoanModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RuleEngineService,
    ApiKeyGuard,
    AdminApiKeyGuard,
    { provide: APP_INTERCEPTOR, useClass: TimingInterceptor },
  ],
})
export class AppModule {}
