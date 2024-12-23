import express from 'express';
import { facultyController } from './faculty.controller';
import auth from '../Auth/auth';
import { USER_ROLE } from '../user/user.constant';
const router = express.Router();

router.get('/', auth(USER_ROLE.faculty), facultyController.getALLFaculties);

export const FacultyRouter = router;
