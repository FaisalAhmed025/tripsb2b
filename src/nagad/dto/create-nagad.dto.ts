// // create-payment.dto.ts
// import { IsNumber, IsString, IsObject, IsIn } from 'class-validator';

// export enum ClientType {
//    Web = 'web',
//    Android = 'android',
//    IOS = 'ios',
//    External = 'external',
//  }
// // create-nagad.dto.ts
// export class CreatePaymentDto {
//   @IsNumber()
//   amount: string;

//   @IsString()
//   ip: string;

//   @IsString()
//   orderId: string;

//   @IsObject()
//   productDetails: Record<string, any>;

//   @IsString()
//   @IsIn(Object.values(ClientType)) // Validate against allowed client types
//   clientType: ClientType;
// }
