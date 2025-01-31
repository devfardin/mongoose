/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import QueryBuilder from '../../app/builder/QueryBuilder';
import { CourseSearchAbleFields } from './course.constant';
import { TCourse } from './course.interface';
import { CourseFacultyModel, CourseModel } from './course.mode';
import AppError from '../../app/errors/AppError';
import httpStatus from 'http-status';
import { TCourseFaculty } from './course.interface';

const createCourses = async (payload: TCourse) => {
  const result = await CourseModel.create(payload);
  return result;
};
const getAllCourseFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.modelQuery;
  return result;
};
const getSingleCourseFromDB = async (courseId: string) => {
  const result = await CourseModel.findById(courseId).populate(
    'preRequisiteCourses.course',
  );
  return result;
};
const deleteCourseFromDB = async (courseId: string) => {
  const result = await CourseModel.findOneAndUpdate(
    { _id: courseId },
    { isDeleted: true },
    { new: true },
  );
  return result;
};
const updateCourseIntoDB = async (
  courseId: string,
  payload: Partial<TCourse>,
) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // step 1L basic course info update
    const updatedBasicCourseInfo = await CourseModel.findByIdAndUpdate(
      courseId,
      courseRemainingData,
      { new: true, runValidators: true, session },
    );

    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }
    // check if there is any pre requisite courses to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // filter out the deleted fields
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);
      const deletedPreRequisitesCourses = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!deletedPreRequisitesCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }

      // filter out the new course fields
      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );
      const newPreRequisiteCourses = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!newPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }
      const result = await CourseModel.findById(courseId).populate(
        'preRequisiteCourses.course',
      );
      return result;
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const assignFacultiesWithCourseIntoBD = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    { course: id, $addToSet: { faculties: { $each: payload } } },
    {
      upsert: true,
      new: true,
    },
  );
  return result;
};
const removeFacultiesFromCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
    },
  );
  return result;
};
export const CourseService = {
  createCourses,
  getAllCourseFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseIntoDB,
  assignFacultiesWithCourseIntoBD,
  removeFacultiesFromCourseIntoDB,
};
