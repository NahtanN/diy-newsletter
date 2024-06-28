import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
 constructor(private readonly service: NewsletterService) {}

 @Get()
 findAll() {
  return this.service.findAll();
 }

 @Get('/preference/:id')
 findByPreference(@Param('id', ParseIntPipe) id: number) {
  return this.service.findAll(id);
 }

 @Post('/create/:preferenceId')
 create(@Param('preferenceId', ParseIntPipe) preferenceId: number) {
  return this.service.create(preferenceId);
 }

 @Get(':id')
 findOne(@Param('id', ParseIntPipe) id: number) {
  return this.service.findOne(id);
 }
}
