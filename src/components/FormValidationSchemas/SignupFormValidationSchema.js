import * as yup from 'yup';

export const signupSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter valid Email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must have atleast 8 characters'),
});
