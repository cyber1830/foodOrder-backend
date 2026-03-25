import { Request , Response, NextFunction } from "express";
import { findVendor } from "./adminController";
import { generateSignature, validatePassword } from "../utlity/password";
import { VendorUpdateDTO } from "../dto";
import { createFoodDTO } from "../dto/food-dto";
import food from "../models/fooModel";

export const vendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password} =  req.body;
    const existingUser = await findVendor('', email);
    if (!existingUser) {
        return res.status(400).json({
            success: false,
            message: "Vendor with this email does not exist",
        });
    }
    console.log("entered password:", password);
    console.log("stored password:", existingUser.password);
   const validPassword = await validatePassword(password, existingUser.password);   
   if(validPassword) {
     const signature = generateSignature({
        _id: existingUser._id.toString(),
        email: existingUser.email,
        name: existingUser.name,
     });
     return res.status(200).json({
        success: true,
        message: "Login successful",
        signature
     });
   } else {
    return res.status(400).json({
        sucess: false,
        message: "Invalid password",
    });
   }
}


export const getVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if(user) {
            const existingUser = await findVendor(user._id);
            return res.json(existingUser);
        }
        return res.json({ message: "User not found" });
}

export const updateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { foodType, name, address, phone} = <VendorUpdateDTO>req.body;    
    const user = req.user;
        if(user) {
            const existingUser = await findVendor(user._id);
            if(existingUser) {
                existingUser.name = name;
                existingUser.address = address;
                existingUser.phone = phone;
                existingUser.foodType = foodType;
                await existingUser.save();
            }
            return res.json(existingUser);
        }
        return res.json({ message: "User not found" });
}

export const updateVendorProfileImage = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if(user) {
      const vendor = await findVendor(user._id.toString());
      console.log(vendor, "vendor fo");
      if(!vendor) {
        return res.status(404).json({
            success: false,
            message: "Vendor not found",
        }); 
      }
      const files = req.files as Express.Multer.File[];
      const images = files.map(file => file.path);
      vendor.coverImages.push(...images);
      console.log(images, "image paths");
      const result = await vendor.save();
      return res.status(201).json(result);
    }
}

export const updateVendorService = async (req: Request, res: Response, next: NextFunction) => {
       const user = req.user;
        if(user) {
            const existingUser = await findVendor(user._id);
            if(existingUser) {
                existingUser.serviceAvailable = !existingUser.serviceAvailable;
                await existingUser.save();
            }
            return res.json(existingUser);
        }
        return res.json({ message: "User not found" });
}

export const Addfood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if(user) {
      const { name, description, category, foodType, readyTime, price } = <createFoodDTO>req.body;
      const vendor = await findVendor(user._id.toString());
      console.log(vendor, "vendor fo");
      if(!vendor) {
        return res.status(404).json({
            success: false,
            message: "Vendor not found",
        }); 
      }
      const files = req.files as Express.Multer.File[];
      const imagePaths = files.map(file => file.path);
        const createFood = await food.create({
            vendorId: vendor._id.toString(),
            name,
            description,
            category,
            foodType,
            readyTime,
            price,
            images : imagePaths,
        })
        vendor.foods.push(createFood._id);
        await vendor.save();
        return res.status(201).json(createFood);
    }
}

export const Getfoods = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if(user) {
      const foods = await food.find({ vendorId: user._id.toString() });
      return res.status(200).json(foods);
    }
    return res.status(404).json({ message: "Food Information not found" });
}