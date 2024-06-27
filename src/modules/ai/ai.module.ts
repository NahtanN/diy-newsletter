import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { NewsletterModule } from '../newsletter/newsletter.module';
import { AiProcessor } from './ai.processor';

@Module({
  imports: [NewsletterModule],
  providers: [AiService, AiProcessor],
})
export class AiModule {}
