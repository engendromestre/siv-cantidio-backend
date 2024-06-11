import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WrapperDataInterceptor } from './shared-module/interceptors/wrapper-data/wrapper-data.interceptor';
import { EntityValidationErrorFilter } from './shared-module/filters/entity-validation-error.filter';
import { NotFoundErrorFilter } from './shared-module/filters/not-found-error.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalFilters(
    new EntityValidationErrorFilter(),
    new NotFoundErrorFilter(),
  );

  const config = new DocumentBuilder()
    .setTitle('SIV Documentation')
    .setDescription('Plataforma para verificar pacientes construída com o framework Nestjs')
    .setVersion('1.0')
    .addTag('Sistema de Indetidade Visual')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
