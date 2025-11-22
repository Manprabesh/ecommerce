import express from 'express'
export const addressRouter = express.Router();
import {  createAddress, getAddressById } from '../controllers/address_controller.js';
addressRouter.post('/create/address',createAddress);
addressRouter.get('/get/address/:user_id',getAddressById);