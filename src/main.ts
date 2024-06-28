import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
 const app = await NestFactory.create(AppModule);
 app.useGlobalPipes(new ValidationPipe());
 await app.listen(3000, async () => Logger.log(`Application is running on: http://localhost:3000/`));
}
bootstrap();
