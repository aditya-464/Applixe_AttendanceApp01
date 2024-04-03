import * as yup from 'yup';

export const createClassSchema = yup.object().shape({
  subject: yup.string().required('Subject is required'),
  branch: yup.string().required('Branch is required'),
  semester: yup.number().required('Semester is required'),
  section: yup.string().required('Section is required'),
});
