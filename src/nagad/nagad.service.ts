import * as crypto from 'crypto';
import * as fs from 'fs';
import { IClientType, IHeaders } from './interfaces/headers.interface';
const { NagadGateway } = require('nagad-payment-gateway');
import fetch from 'node-fetch';
import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';



// import {
// 	IConfirmPaymentArgs,
// 	ICreatePaymentArgs,
// 	INagadConstructor,
// 	INagadCreatePaymentBody,
// 	INagadSensitiveData,
// } from './interfaces/main.interface';



// import {
// 	INagadCreatePaymentDecryptedResponse,
// 	INagadCreatePaymentResponse,
// 	INagadPaymentURL,
// 	INagadPaymentVerificationResponse,
// } from './interfaces/nagadResponse.interface';
// import { Controller, Injectable, Post, Module } from '@nestjs/common';
// import { NagadException } from './exceptions/NagadException';
// import { catchError, map } from 'rxjs';
// import { HttpService } from '@nestjs/axios/dist/http.service';




@Injectable()
export class NagadGatservice {}

