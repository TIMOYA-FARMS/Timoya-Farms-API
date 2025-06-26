import { Router } from 'express';
import {
  getUserOrders,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus
} from '../controllers/order.js';
import { isAuthenticated } from '../middlewares/auth.js';

const orderRouter = Router();

// User: Get their own orders
orderRouter.get('/orders', isAuthenticated, getUserOrders);

// User: Get details of a specific order (with access control in controller)
orderRouter.get('/orders/:id', isAuthenticated, getOrderDetails);

// Admin: Get all orders
orderRouter.get('/order/admin/all', isAuthenticated, async (req, res, next) => {
  if (req.auth.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  return getAllOrders(req, res, next);
});

// Admin/User: Update order status (admin or order owner)
orderRouter.patch('/orders/:id/status', isAuthenticated, updateOrderStatus);

export default orderRouter;
