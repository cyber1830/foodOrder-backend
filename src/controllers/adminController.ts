import { Request, Response, NextFunction } from 'express';
import vendor, { vendorDocument } from '../models/vendorModel';
import { hashPassword } from '../utlity/password';




export const findVendor = async(id: string | undefined, email?: string) => {
    if (id) {
        return await vendor.findById(id);
    }
    if (email) {
        return await vendor.findOne({ email });
    }
}  

export const Createvendor = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone, address, pincode, foodType, password } = <vendorDocument>req.body;
    const existingVendor = await findVendor('', email);
    if (existingVendor) {
        return res.status(400).json({
            success: false,
            message: "Vendor with this email already exists"
        });
    }

    //generate a salt
    //encrypt the password using salt and bcrypt
    const userPassword = await hashPassword(password);
    const createVendor = await vendor.create({
        name,
        ownerName: name,
        email,
        phone,
        address,
        pincode,
        foodType,
        password: userPassword,
        rating: 5,
        serviceAvailable: true,
        coverImages: []
    });
    if (!createVendor) {
        return res.status(400).json({
            success: false,
            message: "Failed to create vendor"
        });
    }
    return res.status(201).json({
        success: true,
        message: "Vendor created successfully",
        data: createVendor
    });
}



export const GetAllVendors = async (req: Request, res: Response, next: NextFunction) => {
    const vendors = await vendor.find();
    if(!vendors) {
        return res.status(400).json({
            success: false,
            message: "Failed to fetch vendors"
        });
    }
    return res.status(200).json({
        success: true,
        message: "Vendors fetched successfully",
        data: vendors
    });
}

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
    const vendorId = req.params.id as string;
    const vendorData = await findVendor(vendorId);
    if(!vendorData) {
        return res.status(400).json({
            success: false,
            message: "Failed to fetch vendor"
        });
    }
    return res.status(200).json({
        success: true,
        message: "Vendor fetched successfully",
        data: vendorData
    });
}

export const UpdateVendor = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const DeleteVendor = async (req: Request, res: Response, next: NextFunction) => {
    
}