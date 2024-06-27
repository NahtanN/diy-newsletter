import { Global, Module } from '@nestjs/common';
import { AppDataSource } from './typeorm/data_source';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options)],
})
export class DatabaseModule {}
