import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { NagadGatservice } from './nagad.service';
import { ICreatePaymentArgs } from './interfaces/main.interface';


@Controller('nagad')
export class NagadController {
  constructor(private readonly nagadService:NagadGatservice) {}




  @Get('createPayment')
  async createPayment(@Res() res) {
    try {
      const paymentConfig: ICreatePaymentArgs = {
        amount: '100',
        ip: '10.10.0.10',
        orderId: '12111243GD',
        productDetails: { a: '1', b: '2' },
        clientType: 'PC_WEB',
      };

      const paymentURL = await this.nagadService.createPayment(paymentConfig);
      res.redirect(paymentURL);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred during payment initiation.');
    }
  }
}
