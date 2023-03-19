import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  const config = new DocumentBuilder()
    .setTitle('Booking api')
    .setDescription('This api documentations')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, () => {
    console.log(`Application starting on http://localhost:${port}`);
  });
}
bootstrap();
