import { ITag } from "@interfaces";
import * as yup from "yup";
import messages from "./messages";

const { required } = messages;

const clipFormValidationSchema = yup
  .object()
  .shape({
    title: yup.string().required(required),
    tags: yup.array<ITag>().notRequired(),
  })
  .required();

export type ClipFormValues = {
  title: string;
  tags?: ITag[];
};

export default clipFormValidationSchema;
