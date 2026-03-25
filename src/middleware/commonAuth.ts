import { AuthPayload } from "../dto/auth-dto";
import { Request, Response, NextFunction } from "express";
import { validateSignature } from "../utlity/password";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}


export const isAuthenticated = async(req: Request, res: Response, next: NextFunction) => {
   const validate  = await validateSignature(req);
   if(validate) {
     next();
   } else {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to access this resource",
      });  
   }
}