import express, { Request, Response, NextFunction } from 'express';
import vendor from '../models/vendorModel';
import { foodDoc } from '../models/fooModel';

export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;
    if(!pincode) {
        return res.status(400).json({ message: "Pincode is required" });
    }
    const result = await vendor.find({ pincode: pincode, serviceAvailable: true }).
    sort([['rating', 'descending']])
    .populate('foods');

    if(result.length > 0) {
        res.status(200).json(result);
    } 

    return res.status(404).json({ message: "Data not found" });

}


export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;
    if(!pincode) {
        return res.status(400).json({ message: "Pincode is required" });
    }
    const result = await vendor.find({ pincode: pincode, serviceAvailable: true }).
    sort([['rating', 'descending']])
    .limit(2);

    if(result.length > 0) {
        res.status(200).json(result);
    } 

    return res.status(404).json({ message: "Pincode not found" });

}

export const GetFoodIn30Min = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;
    if(!pincode) {
        return res.status(400).json({ message: "Pincode is required" });
    }
    const result = await vendor.find({ pincode: pincode, serviceAvailable: true })
    .populate("foods")

    if(result.length > 0) {
        const foodres: any[] = [];
        result.map(vendor => {
            const foods = vendor.foods as foodDoc[];
            const foodIn30Min = foods.filter(food => food.readyTime <= 30);
            foodres.push(...foodIn30Min);
        })
        res.status(200).json(foodres);
    } 

    return res.status(404).json({ message: "Data not found" });

}

export const SearchFood = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;
    if(!pincode) {
        return res.status(400).json({ message: "Pincode is required" });
    }
    const result = await vendor.find({ pincode: pincode, serviceAvailable: false })
    .populate('foods');

    if(result.length > 0) {
        const foods: any[] = [];
        result.map( item => foods.push(...item.foods));  
        res.status(200).json(foods);
    } 

    return res.status(404).json({ message: "Data not found" });

}

export const GetRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await vendor.findById(id).populate('foods');
    console.log(result, "restaurant by id");
    if(result) {
        res.status(200).json(result);
    }
    return res.status(404).json({ message: "Data not found" });
}