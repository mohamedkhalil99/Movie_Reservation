import { Module } from '@nestjs/common';
import { DataBaseModule } from './modules/data-base/data-base.module';

@Module({
  imports: [DataBaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}