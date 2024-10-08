import React, { useEffect } from "react";
import FormInput from "../components/FormInput";
import SubmitButton from "../components/SubmitButton";
import UploadFileInput from "../components/UploadFileInput";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import useSignup from "../customHooks/useSignup";
import { useAppSelector } from "../app/hooks";
import LoadingSpinner from "../components/LoadingSpinner";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface SignUpFormInputs {
  email: string;
  password: string;
  fullname: string;
  username: string;
  avatar: FileList;
}

const SignUpPage: React.FC = () => {
  const auth = useAppSelector((state) => state.auth);
  const { mutateAsync: signup, error } = useSignup();

  // show toast notification on error
  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        closeButton: false,
      });
    }
  }, [error]);

  // validation schema with yup
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long"),
    fullname: Yup.string().required("Full name is required"),
    username: Yup.string()
      .required("Username is required")
      .min(4, "At least 4 characters ")
      .matches(/^\S+$/, "No spaces allowed"),
    avatar: Yup.mixed<FileList>()
      .required("Avatar is required")
      .test("fileType", "Upload a JPEG or PNG file", (value) => {
        if (!value || value.length === 0) return false;
        const file = value[0];
        return ["image/jpeg", "image/png"].includes(file.type);
      })
      .test("fileSize", "File must be less than 2MB", (value) => {
        if (!value || value.length === 0) return false;
        const file = value[0];
        return file.size <= 2 * 1024 * 1024;
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    await signup(data);
  };

  if (auth.loading) {
    return (
      <div className=" min-h-[100vh]  flex-col bg-[#121212] text-white flex justify-center items-center">
        <LoadingSpinner width="8" height="8" />
      </div>
    );
  }

  return (
    <div className=" min-h-[100vh]  flex-col bg-[#121212] text-white flex justify-center items-center">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        transition={Flip}
      />
      <h1 className="text-center text-[40px] font-bold font-Montserrat">
        Play<span className="text-red-700">Tube</span>
      </h1>
      <p className="font-Montserrat text-zinc-300">
        Signup now and Start Sharing Your World Today!
      </p>
      <div className="  mt-20  max-w-[360px] flex justify-center  flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          action="api/v1/users/register"
          className="flex items-center  flex-col gap-8"
        >
          <div className="flex gap-4">
            <FormInput
              id="username"
              name="username"
              placeholder="Username"
              type="text"
              errors={errors.username?.message}
              register={register}
            />
            <FormInput
              id="fullname"
              name="fullname"
              placeholder="Fullname"
              type="text"
              errors={errors.fullname?.message}
              register={register}
            />
          </div>
          <FormInput
            id="email"
            name="email"
            placeholder="Enter your email"
            errors={errors.email?.message}
            register={register}
          />
          <FormInput
            id="password"
            name="password"
            placeholder="Create your password"
            type="password"
            errors={errors.password?.message}
            register={register}
          />
          <UploadFileInput
            label="Upload an Avatar"
            id="uploadAvatar"
            name="avatar"
            errors={errors.avatar?.message}
            register={register}
          />
          <SubmitButton label="Sign up" />
        </form>
      </div>
      <h3 className="mt-8">
        Already have an account?{" "}
        <Link
          className="underline hover:font-semibold transition-all duration-200 ease-in-out"
          to="/auth"
        >
          Sign in now
        </Link>
      </h3>
    </div>
  );
};

export default SignUpPage;
