import { model, Schema } from 'mongoose';
import {
  TCourse,
  TCourseFaculty,
  TPreRequistteCourses,
} from './course.interface';

const preRequisiteCoursesSchema = new Schema<TPreRequistteCourses>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Courses',
  },
  isDeleted: {
    type: Boolean,
    default: false,
    required: [true, 'Course pre requisited courses is required'],
  },
});

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      unique: true,
      trim: true,
    },
    prefix: {
      type: String,
      required: [true, 'Course prefix is required'],
      trim: true,
    },
    code: {
      type: Number,
      trim: true,
      required: [true, 'Course code is required'],
    },
    credits: {
      type: Number,
      requierd: [true, 'Course Credits is required'],
      trim: true,
    },
    preRequisiteCourses: [preRequisiteCoursesSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
export const CourseModel = model<TCourse>('Courses', courseSchema);

const courseFacultiesSchema = new Schema<TCourseFaculty>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Courses',
    unique: true,
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
    },
  ],
});

export const CourseFacultyModel = model<TCourseFaculty>(
  'CourseFaculty',
  courseFacultiesSchema,
);
