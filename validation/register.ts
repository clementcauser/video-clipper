import { passwordRegex } from "@constants";
import * as yup from "yup";
import messages from "./messages";

const { email, password, required } = messages;

const registerValidationSchema = yup
  .object()
  .shape({
    email: yup.string().email(email).required(required),
    password: yup.string().matches(passwordRegex, password).required(required),
    confirmPassword: yup
      .string()
      .matches(passwordRegex, password)
      .oneOf([yup.ref("password")], "Passwords does not match")
      .required(required),
  })
  .required();

export type RegisterFormData = yup.InferType<typeof registerValidationSchema>;

export default registerValidationSchema;
