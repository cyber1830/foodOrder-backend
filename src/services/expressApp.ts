import express, { Application } from 'express';
import adminRoutes from '../routes/adminRoutes';
import vendorRoutes from '../routes/vendorRoutes';
import ShoppingRoutes from '../routes/shoppingRoutes';
import CustomerRoutes from '../routes/customerRoute';

export default async (app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true}));
    app.use('/images', express.static('images'));
    app.use('/admin', adminRoutes);
    app.use('/vendor', vendorRoutes);
    app.use('/user', CustomerRoutes);
    app.use(ShoppingRoutes);
    return app;
}
