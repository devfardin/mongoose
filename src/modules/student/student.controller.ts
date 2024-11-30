import { RequestHandler } from 'express';
import { StudentServices } from './student.service';
import sendResponse from '../../app/utils/sendResponse';
import httpStatus from 'http-status';
const createStudent: RequestHandler = async (req, res, next) => {
  try {
    const StudentInfo = req.body;
    const result = await StudentServices.createStudentIntoDB(StudentInfo);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Successfully created',
      data: result,
    });
    // res.status(200).json({
    //   status: true,
    //   message: 'Student Successfull Created',
    //   data: result,
    // });
  } catch (error) {
    next(error);
    // res.status(500).json({
    //   status: false,
    //   message: 'Someting wrong please try again!',
    //   error,
    // });
  }
};

// export All controlles function
export const StudentControlles = {
  createStudent,
};
