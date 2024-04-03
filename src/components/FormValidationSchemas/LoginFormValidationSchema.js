import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter valid Email'),
  password: yup.string().required('Password is required'),
});
