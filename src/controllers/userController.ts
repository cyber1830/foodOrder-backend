import express, { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserInputs, UserDTO, EditUserProfileInput } from '../dto/user-dto';
import { generateSignature, hashPassword, validatePassword } from '../utlity/password';
import user from '../models/userModel';
import { GenerateOTP, onRequestOTP } from '../utlity/notification';



export const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
      const userInputs = plainToClass(CreateUserInputs, req.body);
      const inputErrors = await validate(userInputs, { validationError: { target: true}} );
      if(inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
      }

      const { email, phone, password } = userInputs;
      const userPassword = await hashPassword(password);
      const { otp, expiry } = await GenerateOTP();
      const existingUser = await user.findOne({ email: email });
      if(existingUser != null) {
        return res.status(400).json({ message: 'A account with this email already exist'});
      }
      const result = await user.create({
        email,
        phone,
        password: userPassword,
        otp,
        otp_expiry: expiry,
        firstName: "",
        lastName: "",
        lat: 0,
        lng: 0
      })

      if(result) {
        // send the otp to customer
        await onRequestOTP(otp, phone);
        // generate the signature
        const signature = generateSignature({
          _id: result._id.toString(),
          email: result.email,
          verified: result.verified.toString()
        });

        // send the result to cline
        return res.status(201).json({ signature: signature, email: result.email, verified: result.verified });
      }
     return res.status(400).json({ message: 'Error with signup' });
}

export const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
     const login = plainToClass(UserDTO, req.body);
     const errors = await validate(login, { validationError: { target: false}});

     if(errors.length>0) {
      return res.status(400).json(errors);
     }
     const { email, password } = login;
     const customer = await user.findOne({ email: email});
     if(customer) {
      const validation = await validatePassword(password, customer.password);
      if(validation) {
        //generate the singature
        const signature = generateSignature({
          _id: customer._id.toString(),
          email: customer.email,
          verified: customer.verified.toString()
        });

        return res.status(201).json({
          signature: signature,
          email: customer.email,
          verified: customer.verified
        });
      }
    }
     return res.status(404).json({ message: 'User Not Found' })
}

export const VerifyUser = async (req: Request, res: Response, next: NextFunction) => {
     const { otp } = req.body;
     const customer = req.user;
     if(customer) {
      const profile = await user.findById(customer._id);
      if(profile) {
        if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
          profile.verified = true;
          const updatedUser = await profile.save();

          const signature = await generateSignature({
            _id: updatedUser._id.toString(),
            email: updatedUser.email,
            verified: updatedUser.verified.toString()
          });

          return res.status(201).json({
            signature: signature,
            verified: updatedUser.verified,
            email: updatedUser.email
          });
        }
      }
    }
    return res.status(400).json({ message: "Could not Verify the OTP"});
}

export const GetOTP = async (req: Request, res: Response, next: NextFunction) => {
     const customer = req.user;
     if(customer) {
      const profile = await user.findById(customer._id);
      if(profile) {
        const {otp, expiry} = GenerateOTP();
        profile.otp = otp;
        profile.otp_expiry = expiry;

        await profile.save();
        await onRequestOTP(otp, profile.phone);
        return res.status(200).json({ message: 'OTP Sent to your registered phone number'});
      }
    }
    return res.status(400).json({ message: 'Unable to Sent OTP'})
}

export const UpdateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
   const customer = req.user;
   const profileInputs = plainToClass(EditUserProfileInput, req.body);
   const profileErrors = await validate(profileInputs, { validationError: { target: false }});
   if(profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
   }

   const { firstName, lastName, address } = profileInputs;
   if(customer) {
    const profile = await user.findById(customer._id);
    if(profile) {
      profile.firstName = firstName,
      profile.lastName = lastName,
      profile.address = address

      const result = await profile.save();
      return res.status(200).json(result);

    }
  }
  return res.status(400).json({ message: 'can not update user Details'});
}

export const UserProfile = async (req: Request, res: Response, next: NextFunction) => {
 const customer = req.user;

  if(customer) {
    const profile = await user.findById(customer._id);
    if(profile) {
     return  res.status(200).json(profile);

    }
  }

  return res.status(400).json({ message: 'Can not Fetch Details'})

}