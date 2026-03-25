import express, { Request, Response, NextFunction } from 'express';
import { CreateUser, GetOTP, LoginUser, UpdateUserProfile, UserProfile, VerifyUser } from '../controllers/userController';
import { isAuthenticated } from '../middleware';

const router = express.Router();

/** signup / create customer */
router.post('/signup', CreateUser);

/** login */
router.post('/login', LoginUser);

//authenticateion required over here

router.use(isAuthenticated);

/** verfiy user account */
router.patch('/verify', VerifyUser);

/** OTP */
router.get('/otp', GetOTP);

/** profile */
router.get('/profile', UserProfile);
router.patch('/profile', UpdateUserProfile);



//cart
//order
//payment

export default router;