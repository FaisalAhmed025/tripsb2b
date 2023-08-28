import { IClientType, IHeaders } from './headers.interface';

/**
 * Configuration Required by the NagadGateway Library
 */

export interface INagadConstructor {
	// /**
	//  * ### Nagad API BaseURL
	//  * @example
	//  * ```
	//  * const baseURL = 'http://sandbox.mynagad.com/remote-payment-gateway'; //no trailing slash
	//  * ```
	//  *
	//  */
	// baseURL: 'http://sandbox.mynagad.com/remote-payment-gateway';
	// merchantID: string;
	// merchantNumber: string;
	// /**
	//  * ### Path to merchant private Key `The keys that you will generate`
	//  * @example
	//  * ```
	//  * const privKeyPath = '.keys/privKey.pem';
	//  * ```
	//  *
	//  */
	// privKey: string;

	// /**
	//  * ### Path to nagad's public key `It's Provided by nagad`
	//  * @example
	//  * ```
	//  * const privKeyPath = '.keys/pubKey.pem';
	//  * ```
	//  *
	//  */
	// pubKey: string;
	// /**
	//  * @example
	//  * ```
	//  * const myCallBackURL = 'https://yoursite.com/payment_redirect_handler';
	//  * ```
	//  */
	callbackURL: 'https://yoursite.com/payment_redirect_handler';
	apiVersion: string;
	isPath: boolean;
	baseURL: 'http://sandbox.mynagad.com:10080';
	merchantID: '683002007104225';
	merchantNumber: '01400001104';
	// pubKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjBH1pFNSSRKPuMcNxmU5jZ1x8K9LPFM4XSu11m7uCfLUSE4SEjL30w3ockFvwAcuJffCUwtSpbjr34cSTD7EFG1Jqk9Gg0fQCKvPaU54jjMJoP2toR9fGmQV7y9fz31UVxSk97AqWZZLJBT2lmv76AgpVV0k0xtb/0VIv8pd/j6TIz9SFfsTQOugHkhyRzzhvZisiKzOAAWNX8RMpG+iqQi4p9W9VrmmiCfFDmLFnMrwhncnMsvlXB8QSJCq2irrx3HG0SJJCbS5+atz+E1iqO8QaPJ05snxv82Mf4NlZ4gZK0Pq/VvJ20lSkR+0nk+s/v3BgIyle78wjZP1vWLU4wIDAQAB' ;
	// privKey: 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCJakyLqojWTDAVUdNJLvuXhROV+LXymqnukBrmiWwTYnJYm9r5cKHj1hYQRhU5eiy6NmFVJqJtwpxyyDSCWSoSmIQMoO2KjYyB5cDajRF45v1GmSeyiIn0hl55qM8ohJGjXQVPfXiqEB5c5REJ8Toy83gzGE3ApmLipoegnwMkewsTNDbe5xZdxN1qfKiRiCL720FtQfIwPDp9ZqbG2OQbdyZUB8I08irKJ0x/psM4SjXasglHBK5G1DX7BmwcB/PRbC0cHYy3pXDmLI8pZl1NehLzbav0Y4fP4MdnpQnfzZJdpaGVE0oI15lq+KZ0tbllNcS+/4MSwW+afvOw9bazAgMBAAECggEAIkenUsw3GKam9BqWh9I1p0Xmbeo+kYftznqai1pK4McVWW9//+wOJsU4edTR5KXK1KVOQKzDpnf/CU9SchYGPd9YScI3n/HR1HHZW2wHqM6O7na0hYA0UhDXLqhjDWuM3WEOOxdE67/bozbtujo4V4+PM8fjVaTsVDhQ60vfv9CnJJ7dLnhqcoovidOwZTHwG+pQtAwbX0ICgKSrc0elv8ZtfwlEvgIrtSiLAO1/CAf+uReUXyBCZhS4Xl7LroKZGiZ80/JE5mc67V/yImVKHBe0aZwgDHgtHh63/50/cAyuUfKyreAH0VLEwy54UCGramPQqYlIReMEbi6U4GC5AQKBgQDfDnHCH1rBvBWfkxPivl/yNKmENBkVikGWBwHNA3wVQ+xZ1Oqmjw3zuHY0xOH0GtK8l3Jy5dRL4DYlwB1qgd/Cxh0mmOv7/C3SviRk7W6FKqdpJLyaE/bqI9AmRCZBpX2PMje6Mm8QHp6+1QpPnN/SenOvoQg/WWYM1DNXUJsfMwKBgQCdtddE7A5IBvgZX2o9vTLZY/3KVuHgJm9dQNbfvtXw+IQfwssPqjrvoU6hPBWHbCZl6FCl2tRh/QfYR/N7H2PvRFfbbeWHw9+xwFP1pdgMug4cTAt4rkRJRLjEnZCNvSMVHrri+fAgpv296nOhwmY/qw5Smi9rMkRY6BoNCiEKgQKBgAaRnFQFLF0MNu7OHAXPaW/ukRdtmVeDDM9oQWtSMPNHXsx+crKY/+YvhnujWKwhphcbtqkfj5L0dWPDNpqOXJKV1wHt+vUexhKwus2mGF0flnKIPG2lLN5UU6rs0tuYDgyLhAyds5ub6zzfdUBG9Gh0ZrfDXETRUyoJjcGChC71AoGAfmSciL0SWQFU1qjUcXRvCzCK1h25WrYS7E6pppm/xia1ZOrtaLmKEEBbzvZjXqv7PhLoh3OQYJO0NM69QMCQi9JfAxnZKWx+m2tDHozyUIjQBDehve8UBRBRcCnDDwU015lQN9YNb23Fz+3VDB/LaF1D1kmBlUys3//r2OV0Q4ECgYBnpo6ZFmrHvV9IMIGjP7XIlVa1uiMCt41FVyINB9SJnamGGauW/pyENvEVh+ueuthSg37e/l0Xu0nm/XGqyKCqkAfBbL2Uj/j5FyDFrpF27PkANDo99CdqL5A4NQzZ69QRlCQ4wnNCq6GsYy2WEJyU2D+K8EBSQcwLsrI7QL7fvQ==';
	headers: IHeaders;
}

export interface INagadCreatePaymentBody extends Record<string, string> {
	accountNumber: string;
	dateTime: string;
	sensitiveData: string;
	signature: string;
}

/**
 * ### Nagad Sensitive Data
 */
export interface INagadSensitiveData extends Record<string, string> {
	/** Merchant ID */
	merchantId: string;
	datetime: string;
	orderId: string;
	challenge: string;
}

export interface IConfirmPaymentArgs {
	paymentReferenceId: string;
	challenge: string;
	orderId: string;
	amount: string;
	productDetails: Record<string, string>;
	ip: string;
}
/**
 * ### Nagad Payment Creation Argument lists
 * ### Required Properties:
 * - orderID `string`
 * - amount `string`
 * - productDetails `object`
 * - ip `string`
 * - clientType `enum`
 */

export interface ICreatePaymentArgs {
	/**
	 * `Merchant Order ID`
	 */
	orderId: string;
	/**
	 * `Amount in String` **BDT**
	 */
	amount: string;
	/**
	 * ### Additional Details for product
	 * `Accepts an object`
	 */
	productDetails: Record<string, string>;
	/**
	 * **Client IP ADDRESS**
	 */
	ip: string;
	/**
	 * ### Client Type
	 * **Possible Values**:
	 * - `'PC_WEB'`
	 * - `'MOBILE_WEB'`
	 * - `'MOBILE_APP'`
	 * - `'WALLET_WEB_VIEW'`
	 * - `'BILL_KEY'`
	 */
	clientType: IClientType;
}
