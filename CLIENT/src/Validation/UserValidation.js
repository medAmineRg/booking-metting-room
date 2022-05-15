import { object, string } from "yup";

export const userSchemaReg = object().shape({
  fullName: string().required("Fullname is required"),
  phone: string().min(10, "Phone length must be 10").max(10).required(),
  email: string().email().required("email is required"),
  password: string()
    .min(8, "password is required (Should be 8 character At least)")
    .required(),
});

export const userSchemaLog = object().shape({
  email: string().email().required(),
  password: string().min(8).required(),
});
