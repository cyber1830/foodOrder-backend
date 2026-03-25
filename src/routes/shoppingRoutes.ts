import express, { Request, Response, NextFunction } from 'express';
import { GetFoodAvailability, GetFoodIn30Min, GetRestaurantById, GetTopRestaurants, SearchFood } from '../controllers/shoppingController';

const router = express.Router();


/**food availablity */
router.get('/pincode', GetFoodAvailability);

/** top restaurants */
router.get('/top-restaurants/:pincode', GetTopRestaurants);

/** food available in 30min */
router.get('/food-in-30-min/:pincode', GetFoodIn30Min);

/** search food */
router.get('/search/:pincode', SearchFood);

/** find restaurant by id */
router.get('/restaurant/:id', GetRestaurantById);


export default router;
