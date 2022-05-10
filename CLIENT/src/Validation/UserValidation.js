import { object, string } from "yup";

export const userSchemaReg = object().shape({
  fullName: string().required("Fullname is required"),
  phone: string().min(10).max(10).optional(),
  email: string().email().required("email is required"),
  password: string().min(8).required("password is required"),
});

export const userSchemaLog = object().shape({
  email: string().email().required(),
  password: string().min(8).required(),
});
