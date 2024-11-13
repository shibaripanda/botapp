import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const PORT = process.env.PORT || 5002
  const app = await NestFactory.create(AppModule)
  global.connectUsers = {}
  app.enableCors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  })

  await app.listen(PORT, () => {console.log(`Server started on port = ${PORT}`)})
  
}
bootstrap();