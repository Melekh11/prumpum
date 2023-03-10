import React, { useState } from "react";
import { useFormik } from "formik";
import { checkEmail } from "../helpers/checkers/email";
import { checkLogin } from "../helpers/checkers/login";
import { checkName } from "../helpers/checkers/name";
import { useSelector, useDispatch } from "../hooks/useRedux";
import { type User, userSelector } from "../redux/slices/user";
import { Alert, Box, Button, Checkbox, FormControlLabel } from "@mui/material";
import { checkPassword } from "../helpers/checkers/password";
import { FormPaper } from "../components/FormPaper";
import { TextField } from "../components/TextField";
import { FormPasswordControl } from "../components/FormPasswordControl";
import { userController } from "../controllers/user";
import { styled } from "@mui/material/styles";

type UserData = Omit<User, "positions">;

type UserErrors = {
  [p in keyof UserData]?: UserData[p];
};

type UserDataFields = keyof UserData;

interface PasswordValues {
  password: string;
  confirmPassword: string;
}

type PasswordErrors = {
  [p in keyof PasswordValues]?: PasswordValues[p];
};

const validateData = (values: User): UserErrors => {
  const errorValues: UserErrors = {};

  const loginError = checkLogin(values.login);
  const nameError = checkName(values.name);
  const surnameError = checkName(values.surname);
  const emailError = checkEmail(values.email);

  if (loginError) errorValues.login = loginError;
  if (nameError) errorValues.name = nameError;
  if (surnameError) errorValues.surname = surnameError;
  if (emailError) errorValues.email = emailError;

  return errorValues;
};

const FlexBox = styled(Box)(({theme}) => ({
  marginTop: theme.spacing(4),
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    flexDirection: "column",
  },
  [theme.breakpoints.up('md')]: {
    backgroundColor: 'row',
  },
}))

const validatePassword = (values: PasswordValues) => {
  const errorsPassword: PasswordErrors = {};

  const passwordError = checkPassword(values.password);
  const confirmPasswordError = checkPassword(values.confirmPassword);

  if (passwordError) errorsPassword.password = passwordError;
  if (confirmPasswordError) { errorsPassword.confirmPassword = confirmPasswordError; }

  if (values.password !== values.confirmPassword) {
    errorsPassword.password = "???????????? ???? ???????????? ????????????????????";
    errorsPassword.confirmPassword = "???????????? ???? ???????????? ????????????????????";
  }

  return errorsPassword;
};

export const SettingsPage = () => {
  const user: User = useSelector(userSelector);
  const dispatch = useDispatch();

  const [formDataError, setFormDataError] = useState("");
  const [formPasswordError, setFormPasswordError] = useState("");

  const initialValuesUserData = {
    login: user.login,
    name: user.name,
    surname: user.surname,
    email: user.email
  };

  const formikData = useFormik({
    initialValues: initialValuesUserData,
    validate: validateData,
    onSubmit: (values: User) => {
      userController
        .changeUserData({ ...values, id: user.id }, dispatch)
        .then(() => { setFormDataError(""); })
        .catch((err) => { setFormDataError(err); });
    }
  });

  const formikPassword = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validate: validatePassword,
    onSubmit: (values: PasswordValues) => {
      userController
        .changeUserPassword({ ...user, password: values.password }, dispatch)
        .then(() => { setFormPasswordError(""); })
        .catch((err) => { setFormPasswordError(err); });
    }
  });

  const [isChangingData, setChangingData] = useState(false);
  const [isVisiblePassword, setVisiblePassword] = useState(false);

  const handleClickVisibleButton = () => { setVisiblePassword((st) => !st); };

  const toggleChangingData = () => {
    setChangingData((st) => {
      if (st) {
        formikData.values.login = user.login;
        formikData.values.email = user.email;
        formikData.values.name = user.name;
        formikData.values.surname = user.surname;
        formikData.setErrors({});
      }

      return !st;
    });
  };

  return (
    <FlexBox>
      <FormPaper handleSubmit={formikData.handleSubmit}>
        <TextField
          disabled={!isChangingData}
          name="login"
          label="??????????"
          formik={formikData as any}
        />
        <TextField
          disabled={!isChangingData}
          name="email"
          label="??????????"
          formik={formikData}
        />
        <TextField
          disabled={!isChangingData}
          name="name"
          label="??????"
          formik={formikData}
        />
        <TextField
          disabled={!isChangingData}
          name="surname"
          label="??????????????"
          formik={formikData}
        />

        <FormControlLabel
          control={
            <Checkbox
              color="info"
              checked={isChangingData}
              onChange={toggleChangingData}
              name="togger"
            />
          }
          label="???????????? ??????????????????"
        />

        {!!formDataError && <Alert severity="error">{formDataError}</Alert>}

        <Button
          fullWidth
          color="inherit"
          variant="outlined"
          type="submit"
          disabled={!isChangingData}
        >
          ????????????????
        </Button>
      </FormPaper>

      <FormPaper handleSubmit={formikPassword.handleSubmit}>
        <FormPasswordControl
          title="?????????? ????????????"
          name="password"
          formik={formikPassword}
          isVisible={isVisiblePassword}
          handleClick={handleClickVisibleButton}
        />

        <FormPasswordControl
          title="?????????????????? ????????????"
          name="confirmPassword"
          formik={formikPassword}
          isVisible={isVisiblePassword}
          handleClick={handleClickVisibleButton}
        />

        {!!formPasswordError && (
          <Alert severity="error">{formPasswordError}</Alert>
        )}

        <Button fullWidth color="inherit" variant="outlined" type="submit">
          ????????????????
        </Button>
      </FormPaper>
    </FlexBox>
  );
};
