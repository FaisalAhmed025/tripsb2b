// import fetch from "node-fetch";
// import uniqid from "uniqid";
// import { format } from "date-fns";
// import crypto from "crypto";
// import {
//   encryptSensitiveData,
//   generateDigitalSignature,
//   decryptSensitiveData,
//   isVerifiedDigitalSignature,
// } from "./utils";

// const api_public_key = `-----BEGIN PUBLIC KEY-----\n\n-----END PUBLIC KEY-----`;
// const api_private_key = `-----BEGIN PRIVATE KEY-----\n\n-----END PRIVATE KEY-----`;


// async function CheckOutInit() {
//   const order_id = uniqid().toUpperCase();
//   const date_time = format(new Date(), "yyyyMMddHHmmSS");
//   const merchant_id = ""; // merchant id gose here

//   const checkout_init_sensitive_data = {
//     merchantId: merchant_id,
//     datetime: date_time,
//     orderId: order_id,
//     challenge: crypto.randomBytes(20).toString("hex"),
//   };

//   const checkout_init_body = {
//     //accountNumber optional
//     dateTime: date_time,
//     sensitiveData: encryptSensitiveData({
//       sensitive_data: JSON.stringify(checkout_init_sensitive_data),
//       public_key: api_public_key,
//     }),
//     signature: generateDigitalSignature({
//       sensitive_data: JSON.stringify(checkout_init_sensitive_data),
//       private_key: api_private_key,
//     }),
//   };

//   const checkout_initialize = await fetch(
//     `http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/check-out/initialize/${merchant_id}/${order_id}`,
//     {
//       method: "POST",
//       headers: {
//         "X-KM-IP-V4": "45.118.63.56",//replace this with requesting device/server IP
//         "X-KM-Client-Type": "PC_WEB",
//         "X-KM-Api-Version": "v-0.2.0",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(checkout_init_body),
//     }
//   );
//   const checkout_init_res = await checkout_initialize.json();

//   console.log(checkout_init_res);

//   const decrypted_checkout_init_res = JSON.parse(
//     decryptSensitiveData({
//       sensitive_data: checkout_init_res.sensitiveData,
//       private_key: api_private_key,
//     })
//   );

//   console.log(decrypted_checkout_init_res);

//   const isCheckoutInitVerified = isVerifiedDigitalSignature({
//     sensitive_data: JSON.stringify(decrypted_checkout_init_res),
//     signature: checkout_init_res.signature,
//     public_key: api_public_key,
//   });

//   console.log(isCheckoutInitVerified);

//   //** payment checkout complete */

//   const checkout_complete_sensitive_data = {
//     merchantId: merchant_id,
//     orderId: order_id,
//     amount: "1.00",
//     currencyCode: "050",
//     challenge: decrypted_checkout_init_res.challenge,
//   };

//   const checkout_complete_body = {
//     sensitiveData: encryptSensitiveData({
//       sensitive_data: JSON.stringify(checkout_complete_sensitive_data),
//       public_key: api_public_key,
//     }),
//     signature: generateDigitalSignature({
//       sensitive_data: JSON.stringify(checkout_complete_sensitive_data),
//       private_key: api_private_key,
//     }),
//     merchantCallbackURL: `callbackurl`, //callbackurl
//     additionalMerchantInfo: {
//       //some additionalMerchantInfo
//     },
//   };

//   const checkout_complete = await fetch(
//     `http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/check-out/complete/${decrypted_checkout_init_res.paymentReferenceId}`,
//     {
//       method: "POST",
//       headers: {
//         "X-KM-IP-V4": "45.118.63.56",//replace this with requesting device/server IP
//         "X-KM-Client-Type": "PC_WEB",
//         "X-KM-Api-Version": "v-0.2.0",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(checkout_complete_body),
//     }
//   );

//   const checkout_complete_res = await checkout_complete.json();
//   console.log(checkout_complete_res);

//   //** payment verify */
//   const payment_reference_id = "payment_reference_id gose here";

//   const payment_verify = await fetch(
//     `http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/verify/payment/${payment_reference_id}`,
//     {
//       method: "GET",
//       headers: {
//         "X-KM-IP-V4": "45.118.63.56",//replace this with requesting device/server IP
//         "X-KM-Client-Type": "PC_WEB",
//         "X-KM-Api-Version": "v-0.2.0",
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   const payment_verify_res = await payment_verify.json();
//   console.log(payment_verify_res);
// }

// CheckOutInit();
