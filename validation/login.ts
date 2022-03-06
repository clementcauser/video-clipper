import { passwordRegex } from "@constants";
import * as yup from "yup";
import messages from "./messages";

const { email, password, required } = messages;

const loginValidationSchema = yup
  .object()
  .shape({
    email: yup.string().email(email).required(required),
    password: yup.string().matches(passwordRegex, password).required(required),
  })
  .required();

export type LoginFormData = yup.InferType<typeof loginValidationSchema>;

export default loginValidationSchema;
