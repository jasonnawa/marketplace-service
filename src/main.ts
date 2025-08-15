import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { AllExceptionsFilter } from './common/exceptions/all.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    morgan('dev', {
      stream: {
        write: (message) => process.stdout.write(message),
      },
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
