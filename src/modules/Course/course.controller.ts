import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { CourseService } from './course.service';
import httpStatus from 'http-status';

const createCourses = catchAsync(async (req, res) => {
  const body = req.body;
  const result = await CourseService.createCourses(body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Successfully created',
    data: result,
  });
});
const getAllCourse = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await CourseService.getAllCourseFromDB(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course are retrieved successfully',
    data: result,
  });
});
const getSingleCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseService.getSingleCourseFromDB(courseId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is retrived Succesfully',
    data: result,
  });
});
const deleteCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseService.deleteCourseFromDB(courseId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Delete Successfully',
    data: result,
  });
});
const courseUpdate = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const body = req.body;
  const result = await CourseService.updateCourseIntoDB(courseId, body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Update Successfully',
    data: result,
  });
});
const assignFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseService.assignFacultiesWithCourseIntoBD(
    courseId,
    faculties,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties assigned Successfull',
    data: result,
  });
});
const removeFacultiesWithCourseFromDB = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseService.removeFacultiesFromCourseIntoDB(
    courseId,
    faculties,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties remove succesfully',
    data: result,
  });
});
export const courseController = {
  createCourses,
  getAllCourse,
  getSingleCourse,
  deleteCourse,
  courseUpdate,
  assignFacultiesWithCourse,
  removeFacultiesWithCourseFromDB,
};
