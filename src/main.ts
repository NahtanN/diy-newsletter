import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
 const app = await NestFactory.create(AppModule);
 app.useGlobalPipes(new ValidationPipe());

 const config = new DocumentBuilder().addBearerAuth().setTitle('Produtiva API').setVersion('1.0').build();
 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('docs', app, document);

 await app.listen(3000, async () => Logger.log(`Application is running on: http://localhost:3000/`));
}
bootstrap();
