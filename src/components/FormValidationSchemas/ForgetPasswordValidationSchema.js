import * as yup from 'yup';

export const forgetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter valid Email'),
});
