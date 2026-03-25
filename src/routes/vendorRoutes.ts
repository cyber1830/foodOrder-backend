import express, { Request, Response, NextFunction } from 'express';
import { Addfood, Getfoods, getVendorProfile, updateVendorProfile, updateVendorProfileImage, updateVendorService, vendorLogin } from '../controllers/vendorController';
import { isAuthenticated } from '../middleware/commonAuth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const uploadPath = path.join(__dirname, "../images");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

const imageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const date = new Date().toISOString().replace(/:/g, "-");
        cb(null, `${date}-${file.originalname}`);
    }
})

const images = multer({ storage: imageStorage}).array('images', 10)

router.post('/login', vendorLogin);

router.use(isAuthenticated);
router.get('/profile', getVendorProfile);
router.patch('/profile', updateVendorProfile);
router.patch('/service', updateVendorService);
router.patch('/coverImage', images, updateVendorProfileImage)


router.post('/food', images,  Addfood);
router.get('/foods', Getfoods);
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({  message: 'Hello from Admin'})
});


export default router;