import express from 'express';
import { orderValidate } from '../middleware/validat.js';
import { cancleOrder, createOrder } from '../controllers/orederController.js';

const orderRoutes = express.Router()


orderRoutes.post("/",orderValidate,createOrder)
orderRoutes.post("/:id",cancleOrder)

export default orderRoutes