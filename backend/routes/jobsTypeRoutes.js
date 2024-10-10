import express from 'express';
const router = express.Router();
import { createJobType, allJobsType, updateJobType, deleteJobType } from '../controllers/jobTypeController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';



//job type routes

// /api/type/create
router.post('/type/create', isAuthenticated, isAdmin, createJobType)
// /api/type/jobs
router.get('/type/jobs', allJobsType)
// /api/type/update/type_id
router.put('/type/update/:type_id', isAuthenticated, isAdmin, updateJobType)
// /api/type/delete/type_id
router.delete('/type/delete/:type_id', isAuthenticated, isAdmin, deleteJobType)








export default router;