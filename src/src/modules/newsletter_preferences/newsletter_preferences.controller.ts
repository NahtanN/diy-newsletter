import { Body, Controller, Post } from '@nestjs/common';
import { NewsletterPreferencesService } from './newsletter_preferences.service';
import { SavePreferencesDto } from './dtos/save_preferences.dto';

@Controller('newsletter-preferences')
export class NewsletterPreferencesController {
  constructor(private readonly service: NewsletterPreferencesService) {}

  @Post()
  savePreferences(@Body() body: SavePreferencesDto) {
    return this.service.save(body);
  }
}
