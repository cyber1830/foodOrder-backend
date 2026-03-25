import express, { Request, Response, NextFunction, Router } from 'express';
import { Createvendor, GetAllVendors, GetVendorById } from '../controllers/adminController';


const router = express.Router();
router.post('/vendor', Createvendor);
router.get('/vendors', GetAllVendors);
router.get('/vendor/:id', GetVendorById);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({  message: 'Hello from Admin'})
});


export default router;