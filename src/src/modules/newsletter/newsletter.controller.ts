import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly service: NewsletterService) {}

  @Post('/create/:preferenceId')
  create(@Param('preferenceId', ParseIntPipe) preferenceId: number) {
    return this.service.create(preferenceId);
  }
}
