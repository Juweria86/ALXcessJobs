import express from "express";
const router = express.Router();
import { signup, signin, logout } from '../controllers/authController.js';


//auth routes
// /api/signup
router.post('/signup', signup);
// /api/signin
router.post('/signin', signin);
// /api/logout
router.get('/logout', logout);

export default router;