// email
// notifications
// sms

import { AUTH_TOKEN, TWILIO_ACCOUNT_SID } from "../config/otp";

//otp

export const GenerateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(expiry.getTime() + 30 * 60 * 1000);
    return { otp, expiry };
}



export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
    // integrate with third party sms provider
    const accountSid = TWILIO_ACCOUNT_SID;
    const authToken = AUTH_TOKEN; 
    const client = require('twilio')(accountSid, authToken);
    const response = await client.messages.create({
        body: `OTP is ${otp}`,
        from: '+13185833933',
        to: `+91${toPhoneNumber}`,
    });
    return response;
    //console.log(`OTP for ${toPhoneNumber} is ${otp}`);
}

export const onRequestEmailOTP = async (otp: number, toEmail: string) => {
    // integrate with third party email provider
    console.log(`OTP for ${toEmail} is ${otp}`);
}