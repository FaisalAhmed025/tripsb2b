import * as crypto from 'crypto';
import * as fs from 'fs';
import { IClientType, IHeaders } from './interfaces/headers.interface';
const { NagadGateway } = require('nagad-payment-gateway');
import fetch from 'node-fetch';
import { createHash } from 'crypto';



import {
	IConfirmPaymentArgs,
	ICreatePaymentArgs,
	INagadConstructor,
	INagadCreatePaymentBody,
	INagadSensitiveData,
} from './interfaces/main.interface';



import {
	INagadCreatePaymentDecryptedResponse,
	INagadCreatePaymentResponse,
	INagadPaymentURL,
	INagadPaymentVerificationResponse,
} from './interfaces/nagadResponse.interface';
import { Controller, Injectable, Post, Module } from '@nestjs/common';
import { NagadException } from './exceptions/NagadException';
import { catchError, map } from 'rxjs';
import { HttpService } from '@nestjs/axios/dist/http.service';




@Injectable()
export class NagadGatservice {
	// apiVersion: 'v-0.2.0'
	// baseURL: 'http://sandbox.mynagad.com:10080'
	// merchantID: '683002007104225'
	// merchantNumber: '01400001104'
	// privKey: 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCJakyLqojWTDAVUdNJLvuXhROV+LXymqnukBrmiWwTYnJYm9r5cKHj1hYQRhU5eiy6NmFVJqJtwpxyyDSCWSoSmIQMoO2KjYyB5cDajRF45v1GmSeyiIn0hl55qM8ohJGjXQVPfXiqEB5c5REJ8Toy83gzGE3ApmLipoegnwMkewsTNDbe5xZdxN1qfKiRiCL720FtQfIwPDp9ZqbG2OQbdyZUB8I08irKJ0x/psM4SjXasglHBK5G1DX7BmwcB/PRbC0cHYy3pXDmLI8pZl1NehLzbav0Y4fP4MdnpQnfzZJdpaGVE0oI15lq+KZ0tbllNcS+/4MSwW+afvOw9bazAgMBAAECggEAIkenUsw3GKam9BqWh9I1p0Xmbeo+kYftznqai1pK4McVWW9//+wOJsU4edTR5KXK1KVOQKzDpnf/CU9SchYGPd9YScI3n/HR1HHZW2wHqM6O7na0hYA0UhDXLqhjDWuM3WEOOxdE67/bozbtujo4V4+PM8fjVaTsVDhQ60vfv9CnJJ7dLnhqcoovidOwZTHwG+pQtAwbX0ICgKSrc0elv8ZtfwlEvgIrtSiLAO1/CAf+uReUXyBCZhS4Xl7LroKZGiZ80/JE5mc67V/yImVKHBe0aZwgDHgtHh63/50/cAyuUfKyreAH0VLEwy54UCGramPQqYlIReMEbi6U4GC5AQKBgQDfDnHCH1rBvBWfkxPivl/yNKmENBkVikGWBwHNA3wVQ+xZ1Oqmjw3zuHY0xOH0GtK8l3Jy5dRL4DYlwB1qgd/Cxh0mmOv7/C3SviRk7W6FKqdpJLyaE/bqI9AmRCZBpX2PMje6Mm8QHp6+1QpPnN/SenOvoQg/WWYM1DNXUJsfMwKBgQCdtddE7A5IBvgZX2o9vTLZY/3KVuHgJm9dQNbfvtXw+IQfwssPqjrvoU6hPBWHbCZl6FCl2tRh/QfYR/N7H2PvRFfbbeWHw9+xwFP1pdgMug4cTAt4rkRJRLjEnZCNvSMVHrri+fAgpv296nOhwmY/qw5Smi9rMkRY6BoNCiEKgQKBgAaRnFQFLF0MNu7OHAXPaW/ukRdtmVeDDM9oQWtSMPNHXsx+crKY/+YvhnujWKwhphcbtqkfj5L0dWPDNpqOXJKV1wHt+vUexhKwus2mGF0flnKIPG2lLN5UU6rs0tuYDgyLhAyds5ub6zzfdUBG9Gh0ZrfDXETRUyoJjcGChC71AoGAfmSciL0SWQFU1qjUcXRvCzCK1h25WrYS7E6pppm/xia1ZOrtaLmKEEBbzvZjXqv7PhLoh3OQYJO0NM69QMCQi9JfAxnZKWx+m2tDHozyUIjQBDehve8UBRBRcCnDDwU015lQN9YNb23Fz+3VDB/LaF1D1kmBlUys3//r2OV0Q4ECgYBnpo6ZFmrHvV9IMIGjP7XIlVa1uiMCt41FVyINB9SJnamGGauW/pyENvEVh+ueuthSg37e/l0Xu0nm/XGqyKCqkAfBbL2Uj/j5FyDFrpF27PkANDo99CdqL5A4NQzZ69QRlCQ4wnNCq6GsYy2WEJyU2D+K8EBSQcwLsrI7QL7fvQ=='
	// pubKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjBH1pFNSSRKPuMcNxmU5jZ1x8K9LPFM4XSu11m7uCfLUSE4SEjL30w3ockFvwAcuJffCUwtSpbjr34cSTD7EFG1Jqk9Gg0fQCKvPaU54jjMJoP2toR9fGmQV7y9fz31UVxSk97AqWZZLJBT2lmv76AgpVV0k0xtb/0VIv8pd/j6TIz9SFfsTQOugHkhyRzzhvZisiKzOAAWNX8RMpG+iqQi4p9W9VrmmiCfFDmLFnMrwhncnMsvlXB8QSJCq2irrx3HG0SJJCbS5+atz+E1iqO8QaPJ05snxv82Mf4NlZ4gZK0Pq/VvJ20lSkR+0nk+s/v3BgIyle78wjZP1vWLU4wIDAQAB'
	// isPath: false
	headers: IHeaders;
	callbackURL: string;
	nagadGateway:any

constructor(private readonly httpService: HttpService) {
//   const configsa = {
// 	 apiVersion: 'v-0.2.0',
// 	 baseURL: 'http://sandbox.mynagad.com:10080',
// 	 merchantID: '683002007104225',
// 	 merchantNumber: '01400001104',
// 	 privKey: 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCJakyLqojWTDAVUdNJLvuXhROV+LXymqnukBrmiWwTYnJYm9r5cKHj1hYQRhU5eiy6NmFVJqJtwpxyyDSCWSoSmIQMoO2KjYyB5cDajRF45v1GmSeyiIn0hl55qM8ohJGjXQVPfXiqEB5c5REJ8Toy83gzGE3ApmLipoegnwMkewsTNDbe5xZdxN1qfKiRiCL720FtQfIwPDp9ZqbG2OQbdyZUB8I08irKJ0x/psM4SjXasglHBK5G1DX7BmwcB/PRbC0cHYy3pXDmLI8pZl1NehLzbav0Y4fP4MdnpQnfzZJdpaGVE0oI15lq+KZ0tbllNcS+/4MSwW+afvOw9bazAgMBAAECggEAIkenUsw3GKam9BqWh9I1p0Xmbeo+kYftznqai1pK4McVWW9//+wOJsU4edTR5KXK1KVOQKzDpnf/CU9SchYGPd9YScI3n/HR1HHZW2wHqM6O7na0hYA0UhDXLqhjDWuM3WEOOxdE67/bozbtujo4V4+PM8fjVaTsVDhQ60vfv9CnJJ7dLnhqcoovidOwZTHwG+pQtAwbX0ICgKSrc0elv8ZtfwlEvgIrtSiLAO1/CAf+uReUXyBCZhS4Xl7LroKZGiZ80/JE5mc67V/yImVKHBe0aZwgDHgtHh63/50/cAyuUfKyreAH0VLEwy54UCGramPQqYlIReMEbi6U4GC5AQKBgQDfDnHCH1rBvBWfkxPivl/yNKmENBkVikGWBwHNA3wVQ+xZ1Oqmjw3zuHY0xOH0GtK8l3Jy5dRL4DYlwB1qgd/Cxh0mmOv7/C3SviRk7W6FKqdpJLyaE/bqI9AmRCZBpX2PMje6Mm8QHp6+1QpPnN/SenOvoQg/WWYM1DNXUJsfMwKBgQCdtddE7A5IBvgZX2o9vTLZY/3KVuHgJm9dQNbfvtXw+IQfwssPqjrvoU6hPBWHbCZl6FCl2tRh/QfYR/N7H2PvRFfbbeWHw9+xwFP1pdgMug4cTAt4rkRJRLjEnZCNvSMVHrri+fAgpv296nOhwmY/qw5Smi9rMkRY6BoNCiEKgQKBgAaRnFQFLF0MNu7OHAXPaW/ukRdtmVeDDM9oQWtSMPNHXsx+crKY/+YvhnujWKwhphcbtqkfj5L0dWPDNpqOXJKV1wHt+vUexhKwus2mGF0flnKIPG2lLN5UU6rs0tuYDgyLhAyds5ub6zzfdUBG9Gh0ZrfDXETRUyoJjcGChC71AoGAfmSciL0SWQFU1qjUcXRvCzCK1h25WrYS7E6pppm/xia1ZOrtaLmKEEBbzvZjXqv7PhLoh3OQYJO0NM69QMCQi9JfAxnZKWx+m2tDHozyUIjQBDehve8UBRBRcCnDDwU015lQN9YNb23Fz+3VDB/LaF1D1kmBlUys3//r2OV0Q4ECgYBnpo6ZFmrHvV9IMIGjP7XIlVa1uiMCt41FVyINB9SJnamGGauW/pyENvEVh+ueuthSg37e/l0Xu0nm/XGqyKCqkAfBbL2Uj/j5FyDFrpF27PkANDo99CdqL5A4NQzZ69QRlCQ4wnNCq6GsYy2WEJyU2D+K8EBSQcwLsrI7QL7fvQ==',
// 	 pubKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjBH1pFNSSRKPuMcNxmU5jZ1x8K9LPFM4XSu11m7uCfLUSE4SEjL30w3ockFvwAcuJffCUwtSpbjr34cSTD7EFG1Jqk9Gg0fQCKvPaU54jjMJoP2toR9fGmQV7y9fz31UVxSk97AqWZZLJBT2lmv76AgpVV0k0xtb/0VIv8pd/j6TIz9SFfsTQOugHkhyRzzhvZisiKzOAAWNX8RMpG+iqQi4p9W9VrmmiCfFDmLFnMrwhncnMsvlXB8QSJCq2irrx3HG0SJJCbS5+atz+E1iqO8QaPJ05snxv82Mf4NlZ4gZK0Pq/VvJ20lSkR+0nk+s/v3BgIyle78wjZP1vWLU4wIDAQAB',
// 	 isPath: false,
//   };

//    this.nagadGateway = new NagadGateway(configsa);
}


	/**
	 * ## Initiate a Payment from nagad
	 *
	 * @param createPaymentConfig Arguments for payment creation
	 * @example
	 * ```javascript
	 * const paymentConfig: ICreatePaymentArgs = {
	 *   amount: '100',
	 *   ip: '10.10.0.10',
	 *   orderId: '12111243GD',
	 *   productDetails: { a: '1', b: '2' },
	 *   clientType: 'PC_WEB',
	 * };
	 * const paymentURL = await nagad .createPayment(paymentConfig);
	 * ```
	 * @returns `Payment URL for nagad`
	 *
	 */


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

	async createNagadPayment(createPaymentConfig: ICreatePaymentArgs): Promise<string> {
		const { amount, ip, productDetails, clientType } = createPaymentConfig;
		const merchantID = '683002007104225'
		const orderId =  this.generateCustomTransactionId()
		const endpoint = `http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/check-out/initialize/api/dfs/check-out/initialize/${merchantID}/${orderId}`;
		const timestamp = this.getTimeStamp();

		const sensitive: INagadSensitiveData = {
			merchantId: merchantID,
			datetime: timestamp,
			orderId,
			challenge: this.createHash(orderId),
		};
      const  merchantNumber ="01400001104"
		const payload: INagadCreatePaymentBody = {
			accountNumber: merchantNumber,
			dateTime: timestamp,
			sensitiveData: this.encrypt(sensitive),
			signature: this.sign(sensitive),
		};

		const newIP = ip === '::1' || ip === '127.0.0.1' ? '103.100.200.100' : ip;
		console.log();
		

		const { sensitiveData } = await this.post<INagadCreatePaymentResponse>(endpoint, payload, {
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
		
		const { callBackUrl } = await this.confirmPayment();
		console.log(callBackUrl);
		return callBackUrl;
	}

	// async verifyPayment(paymentRefID: string): Promise<INagadPaymentVerificationResponse> {
	// 	return await this.get<INagadPaymentVerificationResponse>(
	// 		`${this.baseURL}/api/dfs/verify/payment/${paymentRefID}`,
	// 		this.headers
	// 	);
	// }

	private async confirmPayment(): Promise<INagadPaymentURL> {
		const merchantID = '683002007104225'
		const sensitiveData = {
			merchantId: merchantID,
			orderId: this.generateCustomOrderId(),
			amount:'1000',
			currencyCode: '050',
			challenge: this.createHash(this.generateCustomOrderId())
		};

		
		const payload = {
			paymentRefId: this.generateCustomTransactionId(),
			sensitiveData: this.encrypt(sensitiveData),
			signature: this.sign(sensitiveData),
			merchantCallbackURL: this.callbackURL,
			additionalMerchantInfo: {
		
			},
		};
		console.log(sensitiveData);
		
		// const newIP = ip === '::1' || ip === '127.0.0.1' ? '103.100.102.100' : ip;
		return await this.post<INagadPaymentURL>(`http://sandbox.mynagad.com:10080/api/dfs/check-out/complete/${this.generateCustomOrderId()}`, payload, {
			...this.headers,
			// 'X-KM-IP-V4': newIP,
			// 'X-KM-Client-Type': clientType,
		});
	}

	private encrypt<T>(data: T): string {
	const pgPublicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiCWvxDZZesS1g1lQfilVt8l3X5aMbXg5WOCYdG7q5C+Qevw0upm3tyYiKIwzXbqexnPNTHwRU7Ul7t8jP6nNVS/jLm35WFy6G9qRyXqMc1dHlwjpYwRNovLc12iTn1C5lCqIfiT+B/O/py1eIwNXgqQf39GDMJ3SesonowWioMJNXm3o80wscLMwjeezYGsyHcrnyYI2LnwfIMTSVN4T92Yy77SmE8xPydcdkgUaFxhK16qCGXMV3mF/VFx67LpZm8Sw3v135hxYX8wG1tCBKlL4psJF4+9vSy4W+8R5ieeqhrvRH+2MKLiKbDnewzKonFLbn2aKNrJefXYY7klaawIDAQAB';
  const public_key = `-----BEGIN PUBLIC KEY-----\n${pgPublicKey}\n-----END PUBLIC KEY-----`;
		const signerObject = crypto.publicEncrypt(
			{ key: public_key, padding: crypto.constants.RSA_PKCS1_PADDING },
			Buffer.from(JSON.stringify(data))
		);
		return signerObject.toString('base64');
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
		signerObject.update(JSON.stringify(data));
		signerObject.end();
		return signerObject.sign(mar_pri_key, 'base64');
	}

	private getTimeStamp() {
		const timestamp = Date.now().toString()
		return timestamp;
	}

	private createHash(string: string): string {
		return crypto.createHash('sha1').update(string).digest('hex').toUpperCase();
	}

	// private genKeys(privKeyPath: string, pubKeyPath: string, isPath: boolean): { publicKey: string; privateKey: string } {
	// 	if (!isPath) {
	// 		return {
	// 			privateKey: this.formatKey(privKeyPath, 'PRIVATE'),
	// 			publicKey: this.formatKey(pubKeyPath, 'PUBLIC'),
	// 		};
	// 	}

	// 	const fsPrivKey = fs.readFileSync(privKeyPath, { encoding: 'utf-8' });
	// 	const fsPubKey = fs.readFileSync(pubKeyPath, { encoding: 'utf-8' });
	// 	return { publicKey: this.formatKey(fsPubKey, 'PUBLIC'), privateKey: this.formatKey(fsPrivKey, 'PRIVATE') };
	// }

	// private formatKey(key: string, type: 'PUBLIC' | 'PRIVATE') {
	// 	return /begin/i.test(key) ? key.trim() : `-----BEGIN ${type} KEY-----\n${key.trim()}\n-----END ${type} KEY-----`;
	// }

  async get<T>(url: string, additionalHeaders: IHeaders): Promise<T> {
    const r = await fetch(url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
        ...additionalHeaders,
      },
    });

    const data = await r.json();

    if (data.devMessage) {
      throw new NagadException(data.devMessage, data.reason);
    }
    if (data.reason) {
      throw new NagadException(data.message, data.reason);
    }

    return data;
  }
  async post<T>(
	url: string,
	payload: any,
	additionalHeaders: IHeaders,
 ): Promise<T> {
	const headers = {
	  'content-type': 'application/json',
	  Accept: 'application/json',
	  ...additionalHeaders,
	};

	return this.httpService
	  .post<T>(url, payload, { headers })
	  .pipe(
		 map((response) => {
			const data = response.data;
			// if (data.devMessage) {
			//   throw new NagadException(data.devMessage, data.reason);
			// }

			// if (data.reason) {
			//   throw new NagadException(data.message, data.reason);
			// }
			return data;
		 })
	  )
	  .toPromise();
 }


}


