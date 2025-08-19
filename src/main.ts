import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpErrorFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);
  app.useLogger(logger);
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
      exceptionFactory: (errors) => {
        const messages = errors
          .map((e) => {
            const constraints = Object.values(e.constraints || {});
            return `${e.property}: ${constraints.join(', ')}`;
          })
          .join('; ');
        
        logger.warn('Validation failed', {
          errors: errors.map(e => ({
            property: e.property,
            value: e.value,
            constraints: e.constraints,
          })),
          message: messages,
        });
        
        return new BadRequestException({
          errorCode: 'VALIDATION_ERROR',
          errorMessage: messages,
        });
      },
    }),
  );
  app.useGlobalFilters(new HttpErrorFilter());

  const config = new DocumentBuilder()
    .setTitle('Loan Eligibility API')
    .setVersion('1.0')
    .addApiKey({
      type: 'apiKey',
      name: 'x-api-key',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);
}
bootstrap();
