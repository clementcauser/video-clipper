import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import generateClassName from "@utils/generateClassName";
import schema, { LoginFormData } from "@validation/login";
import { Controller, useForm } from "react-hook-form";

const textFieldClassName = generateClassName("textfield", "login-form");
const submitButtonClassName = generateClassName("submit-button", "login-form");

const Form = styled("form")(({ theme }) => ({
  [`.${textFieldClassName} + .${textFieldClassName}`]: {
    marginTop: theme.spacing(3),
  },
  [`.${submitButtonClassName}`]: {
    marginTop: theme.spacing(3),
  },
}));

type Props = {
  onSubmit: (payload: LoginFormData) => void;
  loading?: boolean;
};

const LoginForm = ({ onSubmit, loading = false }: Props) => {
  const { handleSubmit, control } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(schema),
    shouldUseNativeValidation: false, // deactivate browser's validation messages
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            error={!!error}
            helperText={error?.message}
            label="Votre email"
            placeholder="jean.dupont@mail.com"
            type="email"
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
            error={!!error}
            helperText={error?.message}
            label="Votre mot de passe"
            placeholder="******"
            type="password"
            fullWidth
            className={textFieldClassName}
          />
        )}
      />
      <Button
        className={submitButtonClassName}
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
      >
        {loading ? "Chargement..." : "Se connecter"}
      </Button>
    </Form>
  );
};

export default LoginForm;
