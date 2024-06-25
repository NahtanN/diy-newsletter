import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { NewsletterPreferencesModule } from './src/modules/newsletter_preferences/newsletter_preferences.module';
import { DatabaseModule } from './src/providers/database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, NewsletterPreferencesModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
