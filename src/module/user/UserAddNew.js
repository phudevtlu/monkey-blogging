import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/button";
import { Radio } from "components/checkbox";
import { Field } from "components/field";
import FieldCheckboxes from "components/field/FieldCheckboxes";
import UploadImage from "components/image/UploadImage";
import { Input } from "components/input";
import { Label } from "components/label";
import { auth, db } from "firebase-app/firebase-config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import useFirebaseImage from "hooks/useFirebaseImage";
import DashboardHeading from "module/dashboard/DashboardHeading";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import { userRole, userStatus } from "utils/constants";
import * as yup from "yup";

const schema = yup.object({
  fullname: yup.string().required("Please enter your fullname"),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter your email address"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 characters or greater")
    .required("Please enter your password"),
  username: yup.string().required("Please enter your username"),
  status: yup.string().required("Please enter your status"),
  role: yup.string().required("Please enter your role"),
});

const UserAddNew = () => {
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    getValues,
    reset,
    formState: { isSubmitting, isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
      avatar: "",
      status: Number(userStatus.ACTIVE),
      role: Number(userRole.USER),
      createdAt: new Date(),
    },
  });
  const watchStatus = watch("status");
  const watchRole = watch("role");
  const {
    image,
    handleResetUpload,
    progress,
    handleSelectImage,
    handleDeleteImage,
  } = useFirebaseImage(setValue, getValues);
  const handleAddUser = async (values) => {
    if (!isValid) return;
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      await addDoc(collection(db, "users"), {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        username: slugify(values.username || values.fullname, { lower: true }),
        avatar: image,
        status: Number(values.status),
        role: Number(values.role),
        createdAt: serverTimestamp(),
      });
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, {
          displayName: values.fullname,
        });
      }
      toast.success(
        `Created new user with email: ${values.email} successfully`
      );
      handleResetUpload();
      reset({
        fullname: "",
        username: "",
        email: "",
        password: "",
        avatar: "",
        status: Number(userStatus.ACTIVE),
        role: Number(userRole.USER),
        createdAt: new Date(),
      });
    } catch (error) {
      console.log(error);
      toast.error("Can not create new user");
    }
  };
  useEffect(() => {
    const arrErroes = Object.values(errors);
    if (arrErroes.length > 0) {
      toast.error(arrErroes[0]?.message, {
        pauseOnHover: false,
        delay: 0,
      });
    }
  }, [errors]);
  return (
    <div>
      <DashboardHeading
        title="New user"
        desc="Add new user to system"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleAddUser)}>
        <Field className="w-[200px] mx-auto h-[200px] rounded-full">
          <UploadImage
            handleDeleteImage={handleDeleteImage}
            onChange={handleSelectImage}
            progress={progress}
            image={image}
            className="!rounded-full h-full"
          ></UploadImage>
        </Field>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="Enter your username"
              control={control}
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
            ></Input>
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.ACTIVE}
                onClick={() => setValue("status", userStatus.ACTIVE)}
                value={userStatus.ACTIVE}
              >
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.PENDING}
                onClick={() => setValue("status", userStatus.PENDING)}
                value={userStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.BAN}
                onClick={() => setValue("status", userStatus.BAN)}
                value={userStatus.BAN}
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>
          <Field>
            <Label>Role</Label>
            <FieldCheckboxes>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.ADMIN}
                onClick={() => setValue("role", userRole.ADMIN)}
                value={userRole.ADMIN}
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.MOD}
                onClick={() => setValue("role", userRole.MOD)}
                value={userRole.MOD}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.USER}
                onClick={() => setValue("role", userRole.USER)}
                value={userRole.USER}
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          kind="primary"
          className="mx-auto w-[200px]"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          type="submit"
        >
          Add new user
        </Button>
      </form>
    </div>
  );
};

export default UserAddNew;
