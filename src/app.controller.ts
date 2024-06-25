import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /*@Get()*/
  /*getWebData(): Promise<string> {*/
  /*return this.appService.getWebData();*/
  /*}*/

  /*@Get('/status/:id')*/
  /*getStatus(@Param('id') jobId: string) {*/
  /*return this.appService.getStatus(jobId);*/
  /*}*/

  /*@Post('/scrape')*/
  /*scrape(@Body() req: { url: string }) {*/
  /*return this.appService.scrape(req.url);*/
  /*}*/
}
