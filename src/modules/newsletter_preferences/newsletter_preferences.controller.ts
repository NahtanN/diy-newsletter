import { Body, Controller, Post } from '@nestjs/common';
import { NewsletterPreferencesService } from './newsletter_preferences.service';
import { SavePreferencesDto } from './dtos/save_preferences.dto';
import { ApiTags } from '@nestjs/swagger';
import { NewsletterPreferenceSaveDocs } from 'src/docs/newsletter_preferences/save.docs';

@ApiTags('newsletter-preferences')
@Controller('newsletter-preferences')
export class NewsletterPreferencesController {
	constructor(private readonly service: NewsletterPreferencesService) {}

	@NewsletterPreferenceSaveDocs()
	@Post()
	savePreferences(@Body() body: SavePreferencesDto) {
		return this.service.save(body);
	}
}
