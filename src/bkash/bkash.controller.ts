import { agentService } from 'src/agent/agent.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Query, HttpStatus } from '@nestjs/common';
import { BkashService } from './bkash.service';

import { Request, Response, response } from 'express';
import { createHash } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Bankdeposit, PaymentStatus } from 'src/depositrequest/entities/bankdeposit.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Agent } from 'src/agent/entities/agent.entity';
import { GeneralLedger } from 'src/general-ledger/entities/general-ledger.entity';



@Controller('bkash')
export class BkashController {
  private readonly baseURL = 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized';
  private readonly app_key = 'kfS1YBfX6L9H5KwYmNjJk2d4tc'
  private readonly app_secret = 'n0YtGNOtXQgLHg3Ba3m0LKmJ17HCyisugvgMy0lsuK9r390KBrG5'
  private readonly username ='01993319344'
  private readonly password = 'P5MTa94fSA#'
  
  constructor(
    private readonly agentService: agentService,
    private readonly httpService: HttpService,
    @InjectRepository(Bankdeposit) private bankdepositrepository: Repository<Bankdeposit>,
    @InjectRepository(GeneralLedger) private GeneralLedgerrepository: Repository<GeneralLedger>,
    @InjectRepository(Agent) private agentrepository: Repository<Agent>,
  ) { }

  //Generate TransactionID
  generateCustomTransactionId(): string {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substr(2, 6); // Generate a random alphanumeric string
    const hash = createHash('sha256').update(`TX${timestamp}${randomString}`).digest('hex');
    const shortenedHash = hash.substr(0, 16).toUpperCase();
    return shortenedHash;
  }
//generate customer ID
  generateCustomorderId(): string {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substr(2, 6); // Generate a random alphanumeric string
    const hash = createHash('sha256').update(`OI${timestamp}${randomString}`).digest('hex');
    const shortenedHash = hash.substr(0, 12).toUpperCase();
    return shortenedHash;
  }
  // token generation
  @Post('token')
  async createtoken() {

    // const jwtoken = await this.agentService.verifyToken()
    // const token =  req.headers['authorization']
    const url = `${this.baseURL}/checkout/token/grant`
    const payload = {
      "app_key": this.app_key,
      "app_secret": this.app_secret
    }
    const headers = {
      "accept": "application/json",
      "username": this.username,
      "password": this.password,
      "content-type": "application/json"
    };
    const response = await this.httpService.post(url, payload, { headers }).toPromise()
    return response.data.id_token
  }


  @Post("create")
  async createpayment(
    @Req() req: Request,
    @Res() res: Response,
    ) {
    try {
        //call token generation funtion
      const token = await this.createtoken()
      const endpoint = `${this.baseURL}/checkout/create`;
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `${token}`,
        'X-APP-Key': 'kfS1YBfX6L9H5KwYmNjJk2d4tc',
      };
      const { amount, currency, agentid } = req.body    
      if(parseFloat(amount)<1){
        return res
        .status(HttpStatus.OK)
        .json({ status: 'error', message: 'minimum amount atlest 10 tk'});
      }
      
      const requestData = {
        mode: "0011",
        payerReference: agentid || " ",
        callbackURL: `http://localhost:5000/bkash/callback`,
        amount: amount || "2",
        currency: currency || "BDT",
        intent: 'sale',
        merchantInvoiceNumber: this.generateCustomTransactionId(),
      };
      const response = await this.httpService.post(endpoint, requestData, { headers }).toPromise();
      if (response.status === 200) {
        return res.json(response.data)
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message });
    }
  }


  //execute the transaction
  async executePayment(paymentID: string) {
    const token = await this.createtoken();
    const endpoint = `${this.baseURL}/checkout/execute`
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `${token}`,
      'X-APP-Key': 'kfS1YBfX6L9H5KwYmNjJk2d4tc'
    };
    const body = {
      paymentID
    }
    const response = await axios.post(endpoint, body, { headers })
    console.log(response.data);
    return response.data
  }



  //query status
  @Get('/checkout/status/:paymentID')
  async queryPayment(@Param('paymentID') paymentID: string) {
    const token = await this.createtoken();
    const endpoint = `${this.baseURL}/checkout/payment/status`
    const headers = {
      'content-type': 'application/json',
      accept: 'application/json',
      Authorization: `${token}`,
      'X-APP-Key': 'kfS1YBfX6L9H5KwYmNjJk2d4tc',
    };
    const body = {
      paymentID
    }
    const response = await this.httpService.post(endpoint, body, { headers }).toPromise()
    if (response.status === 200) {
      return response.data
    }
  }


  //callback function
  @Get("callback")
  async Callback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('paymentID') paymentID: string,
    @Query('status') status: string,
  ) {
    //check status
    if (status === "success") {
      try {
        let responsedata = await this.executePayment(paymentID);
        console.log(responsedata);
        if (responsedata.statusCode === '0000' && responsedata.transactionStatus === "Completed") {
          const { amount, trxID, customerMsisdn, merchantInvoiceNumber, paymentExecuteTime, currency, transactionStatus } = responsedata;
          //  save the response data in database
          const instantdeposit = new Bankdeposit();
          instantdeposit.status = PaymentStatus.APPROVED;
          instantdeposit.transactionid = trxID; // Using paymentID as transactionid
          instantdeposit.amount = amount // Parsing amount as a float
          instantdeposit.paymentID = paymentID
          instantdeposit.status = transactionStatus;
          instantdeposit.customerMsisdn = customerMsisdn
          instantdeposit.currency = currency;
          instantdeposit.transactiondate = paymentExecuteTime
          instantdeposit.merchantInvoiceNumber = merchantInvoiceNumber// Parsing date
          await this.bankdepositrepository.save(instantdeposit)
          await this.GeneralLedgerrepository.save(instantdeposit)
          //redierct to front end 
          console.log("Payment Successfully Processed and Saved!");
          res.redirect(`https://flyfarladies.com?message=${transactionStatus}&status=${status}`)

        }
        else {
          const message = responsedata.statusMessage
          const status = 'fail'
          res.redirect(`https://flyfarladies.com/message=${encodeURIComponent(message)}&status=${encodeURIComponent(status)}`)
        }
      }
      catch (error) {
        console.error("Error processing payment:", error);
        // Handle the error appropriately
        res.status(500).json({ error: "An error occurred while processing the payment." });
      }
    } else if (status === 'cancel') {
      const message = 'payement has been cancelled'
      res.redirect(`https://flyfarladies.com?message=${message}&status=${status}`)
    } else if (status === 'failure') {
      const message = 'payment has been failure'
      res.redirect(`https://flyfarladies.com?message=${message}&status=${status}`)
    }
  }

  //Search Transaction Details
  @Get('searchTransaction/:trxID')
  async searchTransaction(@Req() req: Request, @Param('trxID') trxID: string): Promise<any> {
    //endpoint
    const url = `${this.baseURL}/checkout/general/searchTransaction`
    //call th create token funtion for token
    const token = await this.createtoken()
    //headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `${token}`,
      'X-APP-Key': 'kfS1YBfX6L9H5KwYmNjJk2d4tc'
    };
    const data = {
      trxID
    };
    //send http request
    const response = await axios.post(url, data, { headers });
    return response.data;
  }


  //refund transaction
  @Post('refund')
  async createRefund(@Req() req: Request) {
    const url = `${this.baseURL}/checkout/payment/refund`
    //call th create token funtion for token
    const token = await this.createtoken()
    //headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `${token}`,
      'X-APP-Key': 'kfS1YBfX6L9H5KwYmNjJk2d4tc'
    };
    const { paymentID, amount, trxID, sku, reason } = req.body
    const body = {
      paymentID,
      amount,
      trxID,
      sku,
      reason
    }
    //http request
    const response = await axios.post(url, body, { headers });
    return response.data;
  }

}