import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { lengs } from './modules/lenguages/allText';

@Controller('/app')
export class AppController {
  constructor(private appService: AppService) {}

  @Get('/text')
  getText(){
    console.log('text')
    return this.appService.getText()
  }

  @Get('/avleng')
  getAvleng(): any{
    console.log('avleng')
    return lengs
  }

}
