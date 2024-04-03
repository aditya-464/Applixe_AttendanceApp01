import * as yup from 'yup';

export const createNoteSchema = yup.object().shape({
  subject: yup.string().required('Subject is required'),
  content: yup.string().required('Content is required'),
});
