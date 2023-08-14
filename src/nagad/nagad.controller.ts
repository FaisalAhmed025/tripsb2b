import { HttpService } from '@nestjs/axios/dist/http.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, Logger } from '@nestjs/common';

import { createHash } from 'crypto';
import * as crypto from 'crypto';
import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

import * as dotenv from 'dotenv';
import { IClientType, IHeaders } from './interfaces/headers.interface';
import { IConfirmPaymentArgs, ICreatePaymentArgs, INagadConstructor, INagadCreatePaymentBody, INagadSensitiveData } from './interfaces/main.interface';
const NodeRSA = require('node-rsa');
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import * as fs from 'fs';
import { INagadCreatePaymentDecryptedResponse, INagadCreatePaymentResponse, INagadPaymentURL, INagadPaymentVerificationResponse } from './interfaces/nagadResponse.interface';
import { get, post } from './utils/request';
import NagadGateway from 'nagad-payment-gateway';
dotenv.config()



@Controller('nagad')
export class NagadController {
    baseURL: 'http://sandbox.mynagad.com:10080';
	 merchantID: '683002007104225';
	 merchantNumber: '01400001104';
	 pubKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjBH1pFNSSRKPuMcNxmU5jZ1x8K9LPFM4XSu11m7uCfLUSE4SEjL30w3ockFvwAcuJffCUwtSpbjr34cSTD7EFG1Jqk9Gg0fQCKvPaU54jjMJoP2toR9fGmQV7y9fz31UVxSk97AqWZZLJBT2lmv76AgpVV0k0xtb/0VIv8pd/j6TIz9SFfsTQOugHkhyRzzhvZisiKzOAAWNX8RMpG+iqQi4p9W9VrmmiCfFDmLFnMrwhncnMsvlXB8QSJCq2irrx3HG0SJJCbS5+atz+E1iqO8QaPJ05snxv82Mf4NlZ4gZK0Pq/VvJ20lSkR+0nk+s/v3BgIyle78wjZP1vWLU4wIDAQAB' ;
	 privKey: 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCJakyLqojWTDAVUdNJLvuXhROV+LXymqnukBrmiWwTYnJYm9r5cKHj1hYQRhU5eiy6NmFVJqJtwpxyyDSCWSoSmIQMoO2KjYyB5cDajRF45v1GmSeyiIn0hl55qM8ohJGjXQVPfXiqEB5c5REJ8Toy83gzGE3ApmLipoegnwMkewsTNDbe5xZdxN1qfKiRiCL720FtQfIwPDp9ZqbG2OQbdyZUB8I08irKJ0x/psM4SjXasglHBK5G1DX7BmwcB/PRbC0cHYy3pXDmLI8pZl1NehLzbav0Y4fP4MdnpQnfzZJdpaGVE0oI15lq+KZ0tbllNcS+/4MSwW+afvOw9bazAgMBAAECggEAIkenUsw3GKam9BqWh9I1p0Xmbeo+kYftznqai1pK4McVWW9//+wOJsU4edTR5KXK1KVOQKzDpnf/CU9SchYGPd9YScI3n/HR1HHZW2wHqM6O7na0hYA0UhDXLqhjDWuM3WEOOxdE67/bozbtujo4V4+PM8fjVaTsVDhQ60vfv9CnJJ7dLnhqcoovidOwZTHwG+pQtAwbX0ICgKSrc0elv8ZtfwlEvgIrtSiLAO1/CAf+uReUXyBCZhS4Xl7LroKZGiZ80/JE5mc67V/yImVKHBe0aZwgDHgtHh63/50/cAyuUfKyreAH0VLEwy54UCGramPQqYlIReMEbi6U4GC5AQKBgQDfDnHCH1rBvBWfkxPivl/yNKmENBkVikGWBwHNA3wVQ+xZ1Oqmjw3zuHY0xOH0GtK8l3Jy5dRL4DYlwB1qgd/Cxh0mmOv7/C3SviRk7W6FKqdpJLyaE/bqI9AmRCZBpX2PMje6Mm8QHp6+1QpPnN/SenOvoQg/WWYM1DNXUJsfMwKBgQCdtddE7A5IBvgZX2o9vTLZY/3KVuHgJm9dQNbfvtXw+IQfwssPqjrvoU6hPBWHbCZl6FCl2tRh/QfYR/N7H2PvRFfbbeWHw9+xwFP1pdgMug4cTAt4rkRJRLjEnZCNvSMVHrri+fAgpv296nOhwmY/qw5Smi9rMkRY6BoNCiEKgQKBgAaRnFQFLF0MNu7OHAXPaW/ukRdtmVeDDM9oQWtSMPNHXsx+crKY/+YvhnujWKwhphcbtqkfj5L0dWPDNpqOXJKV1wHt+vUexhKwus2mGF0flnKIPG2lLN5UU6rs0tuYDgyLhAyds5ub6zzfdUBG9Gh0ZrfDXETRUyoJjcGChC71AoGAfmSciL0SWQFU1qjUcXRvCzCK1h25WrYS7E6pppm/xia1ZOrtaLmKEEBbzvZjXqv7PhLoh3OQYJO0NM69QMCQi9JfAxnZKWx+m2tDHozyUIjQBDehve8UBRBRcCnDDwU015lQN9YNb23Fz+3VDB/LaF1D1kmBlUys3//r2OV0Q4ECgYBnpo6ZFmrHvV9IMIGjP7XIlVa1uiMCt41FVyINB9SJnamGGauW/pyENvEVh+ueuthSg37e/l0Xu0nm/XGqyKCqkAfBbL2Uj/j5FyDFrpF27PkANDo99CdqL5A4NQzZ69QRlCQ4wnNCq6GsYy2WEJyU2D+K8EBSQcwLsrI7QL7fvQ==';
	 headers: IHeaders;
	 callbackURL: ''; 
  constructor(config: INagadConstructor) {}
		// const { baseURL, callbackURL, merchantID, merchantNumber, privKey, pubKey, apiVersion, isPath } = config;
		// this.baseURL = baseURL;
		// this.merchantID = merchantID;
		// this.merchantNumber = merchantNumber;
		// this.headers = {
		// 	'X-KM-Api-Version': apiVersion,
		// };
		// this.callbackURL = callbackURL;
		// const { privateKey, publicKey } = this.genKeys(privKey, pubKey, isPath);
		// this.privKey = privateKey;
		// this.pubKey = publicKey;

		// dayjs.extend(utc);
		// dayjs.extend(timezone);
	

  private genKeys(privKeyPath: string, pubKeyPath: string, isPath: boolean): { publicKey: string; privateKey: string } {
		if (!isPath) {
			return {
				privateKey: this.formatKey(privKeyPath, 'PRIVATE'),
				publicKey: this.formatKey(pubKeyPath, 'PUBLIC'),
			};
		}

		const fsPrivKey = fs.readFileSync(privKeyPath, { encoding: 'utf-8' });
		const fsPubKey = fs.readFileSync(pubKeyPath, { encoding: 'utf-8' });
		return { publicKey: this.formatKey(fsPubKey, 'PUBLIC'), privateKey: this.formatKey(fsPrivKey, 'PRIVATE') };
	}
  
	private formatKey(key: string, type: 'PUBLIC' | 'PRIVATE') {
		return /begin/i.test(key) ? key.trim() : `-----BEGIN ${type} KEY-----\n${key.trim()}\n-----END ${type} KEY-----`;
	}
  generateCustomTransactionId(): string {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substr(2, 6); // Generate a random alphanumeric string
    const hash = createHash('sha256').update(`${timestamp}${randomString}`).digest('hex');
    const shortenedHash = hash.substr(0, 16).toUpperCase();
    return shortenedHash;
  }

  generateCustomOrderId(): string {
	const timestamp = Date.now().toString();
	const randomString = Math.random().toString(36).substr(2, 6); // Generate a random alphanumeric string
	const hash = createHash('sha256').update(`${timestamp}${randomString}`).digest('hex');
	const shortenedHash = hash.substr(0, 10).toUpperCase();
	return shortenedHash;
 }

 private getTimeStamp() {
  const timestamp = Date.now().toString()
  return timestamp;
}

private createHash(string: string): string {
  return crypto.createHash('sha1').update(string).digest('hex').toUpperCase();
}

private encrypt<T>(data: T): string {
	const pgPublicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiCWvxDZZesS1g1lQfilVt8l3X5aMbXg5WOCYdG7q5C+Qevw0upm3tyYiKIwzXbqexnPNTHwRU7Ul7t8jP6nNVS/jLm35WFy6G9qRyXqMc1dHlwjpYwRNovLc12iTn1C5lCqIfiT+B/O/py1eIwNXgqQf39GDMJ3SesonowWioMJNXm3o80wscLMwjeezYGsyHcrnyYI2LnwfIMTSVN4T92Yy77SmE8xPydcdkgUaFxhK16qCGXMV3mF/VFx67LpZm8Sw3v135hxYX8wG1tCBKlL4psJF4+9vSy4W+8R5ieeqhrvRH+2MKLiKbDnewzKonFLbn2aKNrJefXYY7klaawIDAQAB';
  const public_key = `-----BEGIN PUBLIC KEY-----\n${pgPublicKey}\n-----END PUBLIC KEY-----`;
		const signerObject = crypto.publicEncrypt(
			{ key: public_key, padding: crypto.constants.RSA_PKCS1_PADDING },
			Buffer.from(JSON.stringify(data), 'utf-8')
		);
		return signerObject.toString('base64');
	}


  async createPayment(createPaymentConfig: ICreatePaymentArgs): Promise<string> {
		const { amount, ip, orderId, productDetails, clientType } = createPaymentConfig;
		const endpoint = `${this.baseURL}/api/dfs/check-out/initialize/${this.merchantID}/${orderId}`;
		const timestamp = this.getTimeStamp();

		const sensitive: INagadSensitiveData = {
			merchantId: this.merchantID,
			datetime: timestamp,
			orderId,
			challenge: this.createHash(orderId),
		};

		const payload: INagadCreatePaymentBody = {
			accountNumber: this.merchantNumber,
			dateTime: timestamp,
			sensitiveData: this.encrypt(sensitive),
			signature: this.sign(sensitive),
		};

		const newIP = ip === '::1' || ip === '127.0.0.1' ? '103.100.200.100' : ip;

		const { sensitiveData } = await post<INagadCreatePaymentResponse>(endpoint, payload, {
			...this.headers,
			'X-KM-IP-V4': newIP,
			'X-KM-Client-Type': clientType,
		});

		const decrypted = this.decrypt<INagadCreatePaymentDecryptedResponse>(sensitiveData);
		const { paymentReferenceId, challenge } = decrypted;
		const confirmArgs: IConfirmPaymentArgs = {
			paymentReferenceId,
			challenge,
			orderId,
			amount,
			productDetails,
			ip: newIP,
		};

		const { callBackUrl } = await this.confirmPayment(confirmArgs, clientType);
		return callBackUrl;
	}

	async verifyPayment(paymentRefID: string): Promise<INagadPaymentVerificationResponse> {
		return await get<INagadPaymentVerificationResponse>(
			`${this.baseURL}/api/dfs/verify/payment/${paymentRefID}`,
			this.headers
		);
	}

	private async confirmPayment(data: IConfirmPaymentArgs, clientType: IClientType): Promise<INagadPaymentURL> {
		const { amount, challenge, ip, orderId, paymentReferenceId, productDetails } = data;
		const sensitiveData = {
			merchantId: this.merchantID,
			orderId,
			amount,
			currencyCode: '050',
			challenge,
		};
		const payload = {
			paymentRefId: paymentReferenceId,
			sensitiveData: this.encrypt(sensitiveData),
			signature: this.sign(sensitiveData),
			merchantCallbackURL: this.callbackURL,
			additionalMerchantInfo: {
				...productDetails,
			},
		};
		const newIP = ip === '::1' || ip === '127.0.0.1' ? '103.100.102.100' : ip;
		return await post<INagadPaymentURL>(`${this.baseURL}/api/dfs/check-out/complete/${paymentReferenceId}`, payload, {
			...this.headers,
			'X-KM-IP-V4': newIP,
			'X-KM-Client-Type': clientType,
		});
	}

	private decrypt<T>(data: string): T {
   const pgprivateKey ='MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCJakyLqojWTDAVUdNJLvuXhROV+LXymqnukBrmiWwTYnJYm9r5cKHj1hYQRhU5eiy6NmFVJqJtwpxyyDSCWSoSmIQMoO2KjYyB5cDajRF45v1GmSeyiIn0hl55qM8ohJGjXQVPfXiqEB5c5REJ8Toy83gzGE3ApmLipoegnwMkewsTNDbe5xZdxN1qfKiRiCL720FtQfIwPDp9ZqbG2OQbdyZUB8I08irKJ0x/psM4SjXasglHBK5G1DX7BmwcB/PRbC0cHYy3pXDmLI8pZl1NehLzbav0Y4fP4MdnpQnfzZJdpaGVE0oI15lq+KZ0tbllNcS+/4MSwW+afvOw9bazAgMBAAECggEAIkenUsw3GKam9BqWh9I1p0Xmbeo+kYftznqai1pK4McVWW9//+wOJsU4edTR5KXK1KVOQKzDpnf/CU9SchYGPd9YScI3n/HR1HHZW2wHqM6O7na0hYA0UhDXLqhjDWuM3WEOOxdE67/bozbtujo4V4+PM8fjVaTsVDhQ60vfv9CnJJ7dLnhqcoovidOwZTHwG+pQtAwbX0ICgKSrc0elv8ZtfwlEvgIrtSiLAO1/CAf+uReUXyBCZhS4Xl7LroKZGiZ80/JE5mc67V/yImVKHBe0aZwgDHgtHh63/50/cAyuUfKyreAH0VLEwy54UCGramPQqYlIReMEbi6U4GC5AQKBgQDfDnHCH1rBvBWfkxPivl/yNKmENBkVikGWBwHNA3wVQ+xZ1Oqmjw3zuHY0xOH0GtK8l3Jy5dRL4DYlwB1qgd/Cxh0mmOv7/C3SviRk7W6FKqdpJLyaE/bqI9AmRCZBpX2PMje6Mm8QHp6+1QpPnN/SenOvoQg/WWYM1DNXUJsfMwKBgQCdtddE7A5IBvgZX2o9vTLZY/3KVuHgJm9dQNbfvtXw+IQfwssPqjrvoU6hPBWHbCZl6FCl2tRh/QfYR/N7H2PvRFfbbeWHw9+xwFP1pdgMug4cTAt4rkRJRLjEnZCNvSMVHrri+fAgpv296nOhwmY/qw5Smi9rMkRY6BoNCiEKgQKBgAaRnFQFLF0MNu7OHAXPaW/ukRdtmVeDDM9oQWtSMPNHXsx+crKY/+YvhnujWKwhphcbtqkfj5L0dWPDNpqOXJKV1wHt+vUexhKwus2mGF0flnKIPG2lLN5UU6rs0tuYDgyLhAyds5ub6zzfdUBG9Gh0ZrfDXETRUyoJjcGChC71AoGAfmSciL0SWQFU1qjUcXRvCzCK1h25WrYS7E6pppm/xia1ZOrtaLmKEEBbzvZjXqv7PhLoh3OQYJO0NM69QMCQi9JfAxnZKWx+m2tDHozyUIjQBDehve8UBRBRcCnDDwU015lQN9YNb23Fz+3VDB/LaF1D1kmBlUys3//r2OV0Q4ECgYBnpo6ZFmrHvV9IMIGjP7XIlVa1uiMCt41FVyINB9SJnamGGauW/pyENvEVh+ueuthSg37e/l0Xu0nm/XGqyKCqkAfBbL2Uj/j5FyDFrpF27PkANDo99CdqL5A4NQzZ69QRlCQ4wnNCq6GsYy2WEJyU2D+K8EBSQcwLsrI7QL7fvQ=='
   const mar_pri_key =`-----BEGIN PRIVATE KEY-----\n${pgprivateKey}\n-----END PRIVATE KEY-----`;
		const decrypted = crypto
			.privateDecrypt({ key: mar_pri_key, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(data, 'base64'))
			.toString();
		return JSON.parse(decrypted);
	}

	private sign(data: string | Record<string, string>) {
		const pgprivateKey =' MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCJakyLqojWTDAVUdNJLvuXhROV+LXymqnukBrmiWwTYnJYm9r5cKHj1hYQRhU5eiy6NmFVJqJtwpxyyDSCWSoSmIQMoO2KjYyB5cDajRF45v1GmSeyiIn0hl55qM8ohJGjXQVPfXiqEB5c5REJ8Toy83gzGE3ApmLipoegnwMkewsTNDbe5xZdxN1qfKiRiCL720FtQfIwPDp9ZqbG2OQbdyZUB8I08irKJ0x/psM4SjXasglHBK5G1DX7BmwcB/PRbC0cHYy3pXDmLI8pZl1NehLzbav0Y4fP4MdnpQnfzZJdpaGVE0oI15lq+KZ0tbllNcS+/4MSwW+afvOw9bazAgMBAAECggEAIkenUsw3GKam9BqWh9I1p0Xmbeo+kYftznqai1pK4McVWW9//+wOJsU4edTR5KXK1KVOQKzDpnf/CU9SchYGPd9YScI3n/HR1HHZW2wHqM6O7na0hYA0UhDXLqhjDWuM3WEOOxdE67/bozbtujo4V4+PM8fjVaTsVDhQ60vfv9CnJJ7dLnhqcoovidOwZTHwG+pQtAwbX0ICgKSrc0elv8ZtfwlEvgIrtSiLAO1/CAf+uReUXyBCZhS4Xl7LroKZGiZ80/JE5mc67V/yImVKHBe0aZwgDHgtHh63/50/cAyuUfKyreAH0VLEwy54UCGramPQqYlIReMEbi6U4GC5AQKBgQDfDnHCH1rBvBWfkxPivl/yNKmENBkVikGWBwHNA3wVQ+xZ1Oqmjw3zuHY0xOH0GtK8l3Jy5dRL4DYlwB1qgd/Cxh0mmOv7/C3SviRk7W6FKqdpJLyaE/bqI9AmRCZBpX2PMje6Mm8QHp6+1QpPnN/SenOvoQg/WWYM1DNXUJsfMwKBgQCdtddE7A5IBvgZX2o9vTLZY/3KVuHgJm9dQNbfvtXw+IQfwssPqjrvoU6hPBWHbCZl6FCl2tRh/QfYR/N7H2PvRFfbbeWHw9+xwFP1pdgMug4cTAt4rkRJRLjEnZCNvSMVHrri+fAgpv296nOhwmY/qw5Smi9rMkRY6BoNCiEKgQKBgAaRnFQFLF0MNu7OHAXPaW/ukRdtmVeDDM9oQWtSMPNHXsx+crKY/+YvhnujWKwhphcbtqkfj5L0dWPDNpqOXJKV1wHt+vUexhKwus2mGF0flnKIPG2lLN5UU6rs0tuYDgyLhAyds5ub6zzfdUBG9Gh0ZrfDXETRUyoJjcGChC71AoGAfmSciL0SWQFU1qjUcXRvCzCK1h25WrYS7E6pppm/xia1ZOrtaLmKEEBbzvZjXqv7PhLoh3OQYJO0NM69QMCQi9JfAxnZKWx+m2tDHozyUIjQBDehve8UBRBRcCnDDwU015lQN9YNb23Fz+3VDB/LaF1D1kmBlUys3//r2OV0Q4ECgYBnpo6ZFmrHvV9IMIGjP7XIlVa1uiMCt41FVyINB9SJnamGGauW/pyENvEVh+ueuthSg37e/l0Xu0nm/XGqyKCqkAfBbL2Uj/j5FyDFrpF27PkANDo99CdqL5A4NQzZ69QRlCQ4wnNCq6GsYy2WEJyU2D+K8EBSQcwLsrI7QL7fvQ=='
      const mar_pri_key =`-----BEGIN PRIVATE KEY-----\n${pgprivateKey}\n-----END PRIVATE KEY-----`;
		const signerObject = crypto.createSign('SHA256');
		signerObject.update(JSON.stringify(data), 'utf-8');
		signerObject.end();
		return signerObject.sign(mar_pri_key, 'base64');
	}
 }



