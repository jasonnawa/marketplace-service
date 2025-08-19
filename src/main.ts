import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { AllExceptionsFilter } from './common/exceptions/all.exception';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  const config = new DocumentBuilder()
    .setTitle('MarketPlace')
    .setDescription('API documentation for the marketplace application')
    .setVersion('1.0')
    .addBearerAuth( {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token', )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  app.enableCors({
    origin: ['http://localhost:5173', 'https://marketplace-client-drab.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
  });

  app.use(
    morgan('dev', {
      stream: {
        write: (message) => process.stdout.write(message),
      },
    }),
  );
  app.useGlobalPipes(  new ValidationPipe({
    whitelist: true,
    transform: true, 
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),);
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
