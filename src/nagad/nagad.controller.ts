import { HttpService } from '@nestjs/axios/dist/http.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, Logger } from '@nestjs/common';
import { format } from "date-fns";
import fetch from 'node-fetch';
import { createHash } from 'crypto';
import * as crypto from 'crypto';
import { Request, Response, response } from 'express';
import axios, { AxiosResponse } from 'axios';



@Controller('nagad')
export class NagadController {
	private readonly baseURL = `http://sandbox.mynagad.com:10080`
	private readonly merchantID = '683002007104225';
	private readonly merchantNumber = '01400001104';
	private readonly public_key = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjBH1pFNSSRKPuMcNxmU5jZ1x8K9LPFM4XSu11m7uCfLUSE4SEjL30w3ockFvwAcuJffCUwtSpbjr34cSTD7EFG1Jqk9Gg0fQCKvPaU54jjMJoP2toR9fGmQV7y9fz31UVxSk97AqWZZLJBT2lmv76AgpVV0k0xtb/0VIv8pd/j6TIz9SFfsTQOugHkhyRzzhvZisiKzOAAWNX8RMpG+iqQi4p9W9VrmmiCfFDmLFnMrwhncnMsvlXB8QSJCq2irrx3HG0SJJCbS5+atz+E1iqO8QaPJ05snxv82Mf4NlZ4gZK0Pq/VvJ20lSkR+0nk+s/v3BgIyle78wjZP1vWLU4wIDAQAB';
	private readonly private_key = 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCJakyLqojWTDAVUdNJLvuXhROV+LXymqnukBrmiWwTYnJYm9r5cKHj1hYQRhU5eiy6NmFVJqJtwpxyyDSCWSoSmIQMoO2KjYyB5cDajRF45v1GmSeyiIn0hl55qM8ohJGjXQVPfXiqEB5c5REJ8Toy83gzGE3ApmLipoegnwMkewsTNDbe5xZdxN1qfKiRiCL720FtQfIwPDp9ZqbG2OQbdyZUB8I08irKJ0x/psM4SjXasglHBK5G1DX7BmwcB/PRbC0cHYy3pXDmLI8pZl1NehLzbav0Y4fP4MdnpQnfzZJdpaGVE0oI15lq+KZ0tbllNcS+/4MSwW+afvOw9bazAgMBAAECggEAIkenUsw3GKam9BqWh9I1p0Xmbeo+kYftznqai1pK4McVWW9//+wOJsU4edTR5KXK1KVOQKzDpnf/CU9SchYGPd9YScI3n/HR1HHZW2wHqM6O7na0hYA0UhDXLqhjDWuM3WEOOxdE67/bozbtujo4V4+PM8fjVaTsVDhQ60vfv9CnJJ7dLnhqcoovidOwZTHwG+pQtAwbX0ICgKSrc0elv8ZtfwlEvgIrtSiLAO1/CAf+uReUXyBCZhS4Xl7LroKZGiZ80/JE5mc67V/yImVKHBe0aZwgDHgtHh63/50/cAyuUfKyreAH0VLEwy54UCGramPQqYlIReMEbi6U4GC5AQKBgQDfDnHCH1rBvBWfkxPivl/yNKmENBkVikGWBwHNA3wVQ+xZ1Oqmjw3zuHY0xOH0GtK8l3Jy5dRL4DYlwB1qgd/Cxh0mmOv7/C3SviRk7W6FKqdpJLyaE/bqI9AmRCZBpX2PMje6Mm8QHp6+1QpPnN/SenOvoQg/WWYM1DNXUJsfMwKBgQCdtddE7A5IBvgZX2o9vTLZY/3KVuHgJm9dQNbfvtXw+IQfwssPqjrvoU6hPBWHbCZl6FCl2tRh/QfYR/N7H2PvRFfbbeWHw9+xwFP1pdgMug4cTAt4rkRJRLjEnZCNvSMVHrri+fAgpv296nOhwmY/qw5Smi9rMkRY6BoNCiEKgQKBgAaRnFQFLF0MNu7OHAXPaW/ukRdtmVeDDM9oQWtSMPNHXsx+crKY/+YvhnujWKwhphcbtqkfj5L0dWPDNpqOXJKV1wHt+vUexhKwus2mGF0flnKIPG2lLN5UU6rs0tuYDgyLhAyds5ub6zzfdUBG9Gh0ZrfDXETRUyoJjcGChC71AoGAfmSciL0SWQFU1qjUcXRvCzCK1h25WrYS7E6pppm/xia1ZOrtaLmKEEBbzvZjXqv7PhLoh3OQYJO0NM69QMCQi9JfAxnZKWx+m2tDHozyUIjQBDehve8UBRBRcCnDDwU015lQN9YNb23Fz+3VDB/LaF1D1kmBlUys3//r2OV0Q4ECgYBnpo6ZFmrHvV9IMIGjP7XIlVa1uiMCt41FVyINB9SJnamGGauW/pyENvEVh+ueuthSg37e/l0Xu0nm/XGqyKCqkAfBbL2Uj/j5FyDFrpF27PkANDo99CdqL5A4NQzZ69QRlCQ4wnNCq6GsYy2WEJyU2D+K8EBSQcwLsrI7QL7fvQ=='
	constructor(private readonly httpService: HttpService) { }


   api_public_key = `-----BEGIN PUBLIC KEY-----\n${this.public_key}\n-----END PUBLIC KEY-----`;
   api_private_key = `-----BEGIN PRIVATE KEY-----\n${this.private_key}\n-----END PRIVATE KEY-----`;

	encryptSensitiveData({
		sensitive_data,
		api_public_key,
	}: {
		sensitive_data: string;
		api_public_key: string;
	}) {
		const buffer = Buffer.from(JSON.stringify(sensitive_data))
		const encrypted = crypto.publicEncrypt(
			{
				key: api_public_key,
				padding: crypto.constants.RSA_PKCS1_PADDING,
			},
			buffer,
		);
		console.log();
		return encrypted.toString('base64');
	}


	generateDigitalSignature({
		sensitive_data,
		api_private_key,
	}: {
		sensitive_data: string;
		api_private_key: string;
	}) {
		const sign = crypto.createSign('RSA-SHA256');
		sign.update(sensitive_data);
		sign.end();
		const signature = sign.sign(api_private_key, 'base64');
		return signature;
	}



	decryptSensitiveData({
		sensitive_data,
		private_key,
	}: {
		sensitive_data: string;
		private_key: string;
	}) {
		const buffer = Buffer.from(JSON.stringify(sensitive_data), 'base64');

		const decrypted = crypto.privateDecrypt(
			{
				key: private_key,
				padding: crypto.constants.RSA_PKCS1_PADDING,
			},
			buffer,
		);
		return decrypted.toString();
	}

	isVerifiedDigitalSignature({
		sensitive_data,
		signature,
		public_key,
	}: {
		sensitive_data: string;
		signature: string;
		public_key: string;
	}) {
		const buffer = Buffer.from(signature, 'base64');
		const verify = crypto.createVerify('RSA-SHA256');
		verify.update(sensitive_data);
		verify.end();
		return verify.verify(public_key, buffer);
	}


	@Post('initialize')
	async CheckOutInit() {
		const order_id = this.generateCustomOrderId()
		const date_time = format(new Date(), "yyyyMMddHHmmSS");
		const merchant_id = "683002007104225"; // merchant id gose here

		const checkout_init_sensitive_data = {
			merchantId: merchant_id,
			datetime: date_time,
			orderId: order_id,
			challenge: crypto.randomBytes(20).toString("hex"),
		};

		const checkout_init_body = {
			//accountNumber optional
			dateTime: date_time,
			sensitiveData: this.encryptSensitiveData({
				sensitive_data: JSON.stringify(checkout_init_sensitive_data),
				api_public_key: this.api_public_key,
			}),
			signature: this.generateDigitalSignature({
				sensitive_data:JSON.stringify(checkout_init_sensitive_data),
				api_private_key:this.api_private_key
			})
		};
		console.log(checkout_init_body);
		const checkout_initialize = await fetch(
			`http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/check-out/initialize/${merchant_id}/${order_id}`,
			{
				method: "POST",
				headers: {
					"X-KM-IP-V4": "192.168.1.156",//replace this with requesting device/server IP
					"X-KM-Client-Type": "PC_WEB",
					"X-KM-Api-Version": "v-0.2.0",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(checkout_init_body),
			}
		);
		const checkout_init_res = await checkout_initialize.json();
		console.log(checkout_init_res);
		
		const decrypted_checkout_init_res = JSON.parse(
			this.decryptSensitiveData({
				sensitive_data: checkout_init_res.sensitiveData,
				private_key: this.api_private_key
			})
		);
		console.log(decrypted_checkout_init_res);

		if (checkout_init_res.sensitiveData) {
			const decodedSensitiveData = Buffer.from(
			  checkout_init_res.sensitiveData,
			  "base64"
			).toString("utf8");
			console.log("Decoded Sensitive Data:", decodedSensitiveData);
			}
		// console.log(decrypted_checkout_init_res);
		// const isCheckoutInitVerified = this.isVerifiedDigitalSignature({
		// 	sensitive_data: JSON.stringify(decrypted_checkout_init_res),
		// 	signature: checkout_init_res.signature,
		// 	public_key: this.api_public_key,
		// });

		// console.log(isCheckoutInitVerified);

		// // //** payment checkout complete */

		// const checkout_complete_sensitive_data = {
		// 	merchantId: merchant_id,
		// 	orderId: order_id,
		// 	amount: "1.00",
		// 	currencyCode: "050",
		// 	challenge: decrypted_checkout_init_res.challenge,
		// };

		// const checkout_complete_body = {
		// 	sensitiveData: this.encryptSensitiveData({
		// 		sensitive_data: JSON.stringify(checkout_complete_sensitive_data),
		// 		public_key: this.api_public_key,
		// 	}),
		// 	signature: this.generateDigitalSignature({
		// 		sensitive_data: JSON.stringify(checkout_complete_sensitive_data),
		// 		private_key: this.api_private_key,
		// 	}),
		// 	merchantCallbackURL: `callbackurl`, //callbackurl
		// 	additionalMerchantInfo: {
		// 		//some additionalMerchantInfo
		// 	},
		// };

		// const checkout_complete = await fetch(
		// 	`http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/check-out/complete/${decrypted_checkout_init_res.paymentReferenceId}`,
		// 	{
		// 		method: "POST",
		// 		headers: {
		// 			"X-KM-IP-V4": "45.118.63.56",//replace this with requesting device/server IP
		// 			"X-KM-Client-Type": "PC_WEB",
		// 			"X-KM-Api-Version": "v-0.2.0",
		// 			"Content-Type": "application/json",
		// 		},
		// 		body: JSON.stringify(checkout_complete_body),
		// 	}
		// );

		// const checkout_complete_res = await checkout_complete.json();
		// console.log(checkout_complete_res);

		// //** payment verify */
		// const payment_reference_id = "payment_reference_id gose here";

		// const payment_verify = await fetch(
		// 	`http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/verify/payment/${payment_reference_id}`,
		// 	{
		// 		method: "GET",
		// 		headers: {
		// 			"X-KM-IP-V4": "45.118.63.56",//replace this with requesting device/server IP
		// 			"X-KM-Client-Type": "PC_WEB",
		// 			"X-KM-Api-Version": "v-0.2.0",
		// 			"Content-Type": "application/json",
		// 		},
		// 	}
		// );
		// const payment_verify_res = await payment_verify.json();
		// console.log(payment_verify_res);
	}










	//generate transactionID
	generateCustomTransactionId(): string {
		const timestamp = Date.now().toString();
		const randomString = Math.random().toString(36).substr(2, 6); // Generate a random alphanumeric string
		const hash = createHash('sha256').update(`${timestamp}${randomString}`).digest('hex');
		const shortenedHash = hash.substr(0, 16).toUpperCase();
		return shortenedHash;
	}

	//generate customer orderID
	generateCustomOrderId(): string {
		const timestamp = Date.now().toString();
		const randomString = Math.random().toString(36).substr(2, 6); // Generate a random alphanumeric string
		const hash = createHash('sha256').update(`${timestamp}${randomString}`).digest('hex');
		const shortenedHash = hash.substr(0, 10).toUpperCase();
		return shortenedHash;
	}

	//time formate
	private getTimeStamp() {
		const timestamp = Date.now().toString()
		return timestamp;
	}

	//create random string
	private createHash(string: string): string {
		return crypto.createHash('sha1').update(string).digest('hex').toUpperCase();
	}

	async encrypt() {
		const public_key = this.public_key
		const api_public_key = `-----BEGIN PUBLIC KEY-----\n${public_key}\n-----END PUBLIC KEY-----`;
		const orderId = this.generateCustomOrderId()
		const sensitivedata = {
			merchantId: this.merchantID,
			datetime: this.getTimeStamp(),
			orderId,
			random: this.createHash(orderId),
		}

		const encrypt = crypto.publicEncrypt(
			{
				key: api_public_key,
				padding: crypto.constants.RSA_PKCS1_PADDING
			},
			Buffer.from(JSON.stringify(sensitivedata))
		);
		return encrypt.toString('base64');
	}

	// @Post('decrypt')
	// async decrypt(@Body() encrypteddata: string) {
	// 	const private_key = this.private_key
	// 	const ngaprive_key = `-----BEGIN PRIVATE KEY-----\n${private_key}\n-----END PRIVATE KEY-----`;
	// 	const decrypted = crypto
	// 		.privateDecrypt({
	// 			key: ngaprive_key,
	// 			padding: crypto.constants.RSA_PKCS1_PADDING
	// 		}, Buffer.from((JSON.stringify(encrypteddata), 'utf8')),
	// 		)
	// 	return decrypted.toString('base64');
	// }

	// // generate signature
	// @Post('signature')
	// async generateSignature() {
	// 	const pgprivateKey = 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCJakyLqojWTDAVUdNJLvuXhROV+LXymqnukBrmiWwTYnJYm9r5cKHj1hYQRhU5eiy6NmFVJqJtwpxyyDSCWSoSmIQMoO2KjYyB5cDajRF45v1GmSeyiIn0hl55qM8ohJGjXQVPfXiqEB5c5REJ8Toy83gzGE3ApmLipoegnwMkewsTNDbe5xZdxN1qfKiRiCL720FtQfIwPDp9ZqbG2OQbdyZUB8I08irKJ0x/psM4SjXasglHBK5G1DX7BmwcB/PRbC0cHYy3pXDmLI8pZl1NehLzbav0Y4fP4MdnpQnfzZJdpaGVE0oI15lq+KZ0tbllNcS+/4MSwW+afvOw9bazAgMBAAECggEAIkenUsw3GKam9BqWh9I1p0Xmbeo+kYftznqai1pK4McVWW9//+wOJsU4edTR5KXK1KVOQKzDpnf/CU9SchYGPd9YScI3n/HR1HHZW2wHqM6O7na0hYA0UhDXLqhjDWuM3WEOOxdE67/bozbtujo4V4+PM8fjVaTsVDhQ60vfv9CnJJ7dLnhqcoovidOwZTHwG+pQtAwbX0ICgKSrc0elv8ZtfwlEvgIrtSiLAO1/CAf+uReUXyBCZhS4Xl7LroKZGiZ80/JE5mc67V/yImVKHBe0aZwgDHgtHh63/50/cAyuUfKyreAH0VLEwy54UCGramPQqYlIReMEbi6U4GC5AQKBgQDfDnHCH1rBvBWfkxPivl/yNKmENBkVikGWBwHNA3wVQ+xZ1Oqmjw3zuHY0xOH0GtK8l3Jy5dRL4DYlwB1qgd/Cxh0mmOv7/C3SviRk7W6FKqdpJLyaE/bqI9AmRCZBpX2PMje6Mm8QHp6+1QpPnN/SenOvoQg/WWYM1DNXUJsfMwKBgQCdtddE7A5IBvgZX2o9vTLZY/3KVuHgJm9dQNbfvtXw+IQfwssPqjrvoU6hPBWHbCZl6FCl2tRh/QfYR/N7H2PvRFfbbeWHw9+xwFP1pdgMug4cTAt4rkRJRLjEnZCNvSMVHrri+fAgpv296nOhwmY/qw5Smi9rMkRY6BoNCiEKgQKBgAaRnFQFLF0MNu7OHAXPaW/ukRdtmVeDDM9oQWtSMPNHXsx+crKY/+YvhnujWKwhphcbtqkfj5L0dWPDNpqOXJKV1wHt+vUexhKwus2mGF0flnKIPG2lLN5UU6rs0tuYDgyLhAyds5ub6zzfdUBG9Gh0ZrfDXETRUyoJjcGChC71AoGAfmSciL0SWQFU1qjUcXRvCzCK1h25WrYS7E6pppm/xia1ZOrtaLmKEEBbzvZjXqv7PhLoh3OQYJO0NM69QMCQi9JfAxnZKWx+m2tDHozyUIjQBDehve8UBRBRcCnDDwU015lQN9YNb23Fz+3VDB/LaF1D1kmBlUys3//r2OV0Q4ECgYBnpo6ZFmrHvV9IMIGjP7XIlVa1uiMCt41FVyINB9SJnamGGauW/pyENvEVh+ueuthSg37e/l0Xu0nm/XGqyKCqkAfBbL2Uj/j5FyDFrpF27PkANDo99CdqL5A4NQzZ69QRlCQ4wnNCq6GsYy2WEJyU2D+K8EBSQcwLsrI7QL7fvQ=='
	// 	const mar_pri_key = `-----BEGIN PRIVATE KEY-----\n${pgprivateKey}\n-----END PRIVATE KEY-----`;
	// 	const orderId = this.generateCustomOrderId()
	// 	const data = {
	// 		merchantId: this.merchantID,
	// 		datetime: this.getTimeStamp(),
	// 		orderId,
	// 		random: this.createHash(orderId)

	// 	}
	// 	const signerObject = crypto.createSign('SHA256');
	// 	signerObject.update(JSON.stringify(data), 'utf-8');
	// 	signerObject.end();
	// 	return signerObject.sign(mar_pri_key, 'base64');
	// }


	// @Post('initialize')
	// async createPayment(@Req() req: Request, @Res() res: Response) {
	// 	const orderId = this.generateCustomOrderId()
	// 	const endpoint = `http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/check-out/initialize/${this.merchantID}/${orderId}`;
	// 	const timestamp = this.getTimeStamp();
	// 	// const sensitiveData = {
	// 	// 	merchantId: this.merchantID,
	// 	// 	datetime: timestamp,
	// 	// 	orderId,
	// 	// 	random: this.createHash(orderId),
	// 	// };

	// 	const payload = {
	// 		accountNumber: this.merchantNumber,
	// 		dateTime: timestamp,
	// 		sensitiveData: this.encrypt(),
	// 		signature: this.generateSignature(),
	// 	};

	// 	const headers = {
	// 		'content-type': 'application/json', // Set content-type to JSON
	// 		'X-KM-Api-Version': 'v-0.2.0',
	// 		'X-KM-IP-V4': req.ip,
	// 		'X-KM-Client-Type': 'PC_WEB'
	// 	};
	// 	try {
	// 		const response = await axios.post(endpoint, JSON.stringify(payload), { headers })
	// 		console.log(response);

	// 		return response.data;

	// 	} catch (error) {
	// 		// Handle errors
	// 		console.error('Error:', error);
	// 		res.status(500).send('An error occurred.');
	// 	}




	// 	if (response.data.sensitiveData !== "" && response.data.signature !== "") {
	// 		const pgprivateKey = 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCJakyLqojWTDAVUdNJLvuXhROV+LXymqnukBrmiWwTYnJYm9r5cKHj1hYQRhU5eiy6NmFVJqJtwpxyyDSCWSoSmIQMoO2KjYyB5cDajRF45v1GmSeyiIn0hl55qM8ohJGjXQVPfXiqEB5c5REJ8Toy83gzGE3ApmLipoegnwMkewsTNDbe5xZdxN1qfKiRiCL720FtQfIwPDp9ZqbG2OQbdyZUB8I08irKJ0x/psM4SjXasglHBK5G1DX7BmwcB/PRbC0cHYy3pXDmLI8pZl1NehLzbav0Y4fP4MdnpQnfzZJdpaGVE0oI15lq+KZ0tbllNcS+/4MSwW+afvOw9bazAgMBAAECggEAIkenUsw3GKam9BqWh9I1p0Xmbeo+kYftznqai1pK4McVWW9//+wOJsU4edTR5KXK1KVOQKzDpnf/CU9SchYGPd9YScI3n/HR1HHZW2wHqM6O7na0hYA0UhDXLqhjDWuM3WEOOxdE67/bozbtujo4V4+PM8fjVaTsVDhQ60vfv9CnJJ7dLnhqcoovidOwZTHwG+pQtAwbX0ICgKSrc0elv8ZtfwlEvgIrtSiLAO1/CAf+uReUXyBCZhS4Xl7LroKZGiZ80/JE5mc67V/yImVKHBe0aZwgDHgtHh63/50/cAyuUfKyreAH0VLEwy54UCGramPQqYlIReMEbi6U4GC5AQKBgQDfDnHCH1rBvBWfkxPivl/yNKmENBkVikGWBwHNA3wVQ+xZ1Oqmjw3zuHY0xOH0GtK8l3Jy5dRL4DYlwB1qgd/Cxh0mmOv7/C3SviRk7W6FKqdpJLyaE/bqI9AmRCZBpX2PMje6Mm8QHp6+1QpPnN/SenOvoQg/WWYM1DNXUJsfMwKBgQCdtddE7A5IBvgZX2o9vTLZY/3KVuHgJm9dQNbfvtXw+IQfwssPqjrvoU6hPBWHbCZl6FCl2tRh/QfYR/N7H2PvRFfbbeWHw9+xwFP1pdgMug4cTAt4rkRJRLjEnZCNvSMVHrri+fAgpv296nOhwmY/qw5Smi9rMkRY6BoNCiEKgQKBgAaRnFQFLF0MNu7OHAXPaW/ukRdtmVeDDM9oQWtSMPNHXsx+crKY/+YvhnujWKwhphcbtqkfj5L0dWPDNpqOXJKV1wHt+vUexhKwus2mGF0flnKIPG2lLN5UU6rs0tuYDgyLhAyds5ub6zzfdUBG9Gh0ZrfDXETRUyoJjcGChC71AoGAfmSciL0SWQFU1qjUcXRvCzCK1h25WrYS7E6pppm/xia1ZOrtaLmKEEBbzvZjXqv7PhLoh3OQYJO0NM69QMCQi9JfAxnZKWx+m2tDHozyUIjQBDehve8UBRBRcCnDDwU015lQN9YNb23Fz+3VDB/LaF1D1kmBlUys3//r2OV0Q4ECgYBnpo6ZFmrHvV9IMIGjP7XIlVa1uiMCt41FVyINB9SJnamGGauW/pyENvEVh+ueuthSg37e/l0Xu0nm/XGqyKCqkAfBbL2Uj/j5FyDFrpF27PkANDo99CdqL5A4NQzZ69QRlCQ4wnNCq6GsYy2WEJyU2D+K8EBSQcwLsrI7QL7fvQ=='
	// 		const mar_pri_key = `-----BEGIN PRIVATE KEY-----\n${pgprivateKey}\n-----END PRIVATE KEY-----`;
	// 		const decrypted = crypto.privateDecrypt({
	// 			key: mar_pri_key,
	// 			padding: crypto.constants.RSA_PKCS1_PADDING
	// 		},
	// 			Buffer.from(response.data.sensitivedata, 'utf8'));
	// 		const X = decrypted.toString('base64')
	// 		const randomServer = response.data.challenge;
	// 		const paymentReferenceId = response.data.paymentReferenceId;
	// 		const sensitiveOrderData = {
	// 			merchantId: this.merchantID,
	// 			orderId: orderId,
	// 			currencyCode: '050',
	// 			amount: 50,
	// 			challenge: randomServer,
	// 		};

	// 		const merchantAdditionalInfo = {
	// 			serviceName: "SERVICE_NAME",
	// 			serviceLogoURL: "SERVICE_LOGO",
	// 			additionalFieldNameEN: 'Type',
	// 			additionalFieldNameBN: 'টাইপ',
	// 			additionalFieldValue: 'Payment',
	// 			agentId: "agentId",
	// 		};


	// 		const signerObject2 = crypto.createSign('RSA-SHA1');
	// 		signerObject2.update(JSON.stringify(sensitiveOrderData));
	// 		// Sign the data with the merchant's private key
	// 		const orderSignature = signerObject2.sign(mar_pri_key, 'base64');

	// 		const orderData = {
	// 			sensitiveData: this.encrypt,
	// 			signature: orderSignature,
	// 			merchantCallbackURL: `https://localhost:5000/nagad/verify`,
	// 			additionalMerchantInfo: merchantAdditionalInfo,
	// 		};
	// 		const orderURL = `http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/check-out/complete/${paymentReferenceId}`
	// 		const orderDataResult = await axios.post(orderURL, orderData);
	// 		if (orderDataResult.data.status === 'Success') {
	// 			const callbackUrl = orderDataResult.data.callBackUrl;
	// 			return res.redirect(callbackUrl);
	// 		} else {
	// 			return res.json(orderDataResult.data);
	// 		}
	// 	}



	// async verifyPayment(paymentRefID: string): Promise<INagadPaymentVerificationResponse> {
	// 	return await get<INagadPaymentVerificationResponse>(
	// 		`${this.baseURL}/api/dfs/verify/payment/${paymentRefID}`,
	// 		this.headers
	// 	);
	// }

}

	// private async confirmPayment(@Req() req:Request, @Res() res:Response) {
	// 	const { amount, challenge, ip, orderId, paymentReferenceId, productDetails } = req.body
	// 	const	merchantID ='683002007104225';
	// 	const	merchantNumber= '01400001104';
	// 	const sensitiveData = {
	// 		merchantId: merchantID,
	// 		orderId,
	// 		amount,
	// 		currencyCode: '050',
	// 		challenge,
	// 	};
	// 	const payload = {
	// 		paymentRefId: paymentReferenceId,
	// 		// sensitiveData: this.encrypt(sensitiveData),
	// 		signature: this.sign(sensitiveData),
	// 		merchantCallbackURL: 'https://flyfarladies.com/',
	// 		additionalMerchantInfo: {
	// 			...productDetails,
	// 		},
	// 	};

	// 	const endpoint =`http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/check-out/complete${paymentReferenceId}`
	// 	const headers = {
	// 		'X-KM-Api-Version': 'v-0.1.0',
	// 		'X-KM-IP-V4': req.ip,
	// 		'X-KM-Client-Type': 'PC_WEB'
	// 	 };
	// 	const newIP = ip === '::1' || ip === '127.0.0.1' ? '103.100.102.100' : ip;
	// 	const response = await axios.post(endpoint, sensitiveData, {headers})
	// 	return response.data;
	// }






