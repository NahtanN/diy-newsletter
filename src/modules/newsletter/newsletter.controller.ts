import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { ApiTags } from '@nestjs/swagger';
import { NewsletterCreateDocs } from 'src/docs/newsletter/create.docs';
import { NewsletterFindAllDocs } from 'src/docs/newsletter/find_all.docs';
import { NewsletterFindAllByPreferenceDocs } from 'src/docs/newsletter/find_all_by_preference.docs';
import { NewsletterFindOneDocs } from 'src/docs/newsletter/find_one.docs';

@ApiTags('newsletter')
@Controller('newsletter')
export class NewsletterController {
	constructor(private readonly service: NewsletterService) {}

	@NewsletterFindAllDocs()
	@Get()
	findAll() {
		return this.service.findAll();
	}

	@NewsletterFindAllByPreferenceDocs()
	@Get('/preference/:id')
	findByPreference(@Param('id', ParseIntPipe) id: number) {
		return this.service.findAll(id);
	}

	@NewsletterCreateDocs()
	@Post('/create/:preferenceId')
	create(@Param('preferenceId', ParseIntPipe) preferenceId: number) {
		return this.service.create(preferenceId);
	}

	@NewsletterFindOneDocs()
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.service.findOne(id);
	}
}
