import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe());

  const port: string = process.env.PORT;
  await app.listen(port);
}
bootstrap().then(() => {
  const logger: Logger = new Logger();
  return logger.log('Application has been started', 'main.ts');
});
