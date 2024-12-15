import { z } from 'zod';

const PreRequisiteCourseCalidationSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});
const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    prefix: z.string(),
    code: z.number(),
    creadits: z.number(),
    preRequisiteCourses: z.array(PreRequisiteCourseCalidationSchema).optional(),
  }),
});
export const CourseValidations = {
  createCourseValidationSchema,
};
