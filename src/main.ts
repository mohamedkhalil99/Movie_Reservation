import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {rawBody:true,bodyParser:true});
  app.setGlobalPrefix('api/v1');
  // const dataSource = app.get<DataSource>('DATA_SOURCE');
  // await createAdminUser(dataSource);  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Error during app bootstrap:', err);
  process.exit(1);
});