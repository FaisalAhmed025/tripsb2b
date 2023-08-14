import { Controller, Get, Ip, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  redirectToDestination(@Res() res: Response) {
    return res.redirect('/api');
  }
  @Get('home')
  redirectToDestinatios(@Res() res: Response) {
    return this.appService.getHello()
  }

  @Get('ip')
  async Ipaddress(@Req() req) {
    const fullIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(fullIp);
    // You can send the full IP back in the response if needed
    return { ip: fullIp };
  }
}
