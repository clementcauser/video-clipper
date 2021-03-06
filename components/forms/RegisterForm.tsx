import { yupResolver } from "@hookform/resolvers/yup";
import { styled } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import generateClassName from "@utils/generateClassName";
import registerSchema, { RegisterFormData } from "@validation/register";
import { Controller, useForm } from "react-hook-form";

const textFieldClassName = generateClassName("textfield", "register-form");
const submitButtonClassName = generateClassName(
  "submit-button",
  "register-form"
);

const Form = styled("form")(({ theme }) => ({
  [`.${textFieldClassName} + .${textFieldClassName}`]: {
    marginTop: theme.spacing(3),
  },
  [`.${submitButtonClassName}`]: {
    marginTop: theme.spacing(3),
  },
}));

type Props = {
  onSubmit: (payload: RegisterFormData) => void;
  loading?: boolean;
};

const RegisterForm = ({ onSubmit, loading = false }: Props) => {
  const { handleSubmit, control } = useForm<RegisterFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    shouldUseNativeValidation: false, // deactivate browser validation
    resolver: yupResolver(registerSchema),
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Votre adresse email"
            error={!!error}
            helperText={error?.message}
            type="email"
            placeholder="jean.dupont@mail.com"
            fullWidth
            className={textFieldClassName}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Votre mot de passe"
            error={!!error}
            helperText={error?.message}
            type="password"
            placeholder="******"
            fullWidth
            className={textFieldClassName}
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Confirmation de votre mot de passe"
            error={!!error}
            helperText={error?.message}
            type="password"
            placeholder="******"
            fullWidth
            className={textFieldClassName}
          />
        )}
      />
      <Button
        className={submitButtonClassName}
        disabled={loading}
        type="submit"
        variant="contained"
        fullWidth
      >
        {loading ? "Chargement..." : "Cr??er mon compte"}
      </Button>
    </Form>
  );
};

export default RegisterForm;
