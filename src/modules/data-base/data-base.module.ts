import { Module } from '@nestjs/common';
import { databaseProviders } from './data-base.provider';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DataBaseModule {}