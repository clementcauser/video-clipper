import AuthCard from "@components/auth/AuthCard";
import { RegisterForm } from "@components/forms";
import { Route } from "@constants";
import { styled } from "@mui/material";
import Alert from "@mui/material/Alert";
import MUIContainer from "@mui/material/Container";
import MUILink from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import { useAuth } from "context";
import Link from "next/link";

const Container = styled(MUIContainer)(({ theme }) => ({
  ".auth-card": {
    marginTop: theme.spacing(9),
    ".email-title": {
      marginBottom: theme.spacing(2),
    },
  },
}));

const RegisterPage = () => {
  const { withEmailAndPassword, error } = useAuth();

  return (
    <Container maxWidth="sm">
      <AuthCard title="Création de compte">
        <Typography className="email-title">
          Vous avez déjà un compte ? Vous souhaitez vous connecter avec votre
          compte Google ou Github ? C&apos;est{" "}
          <Link href={Route.LOGIN} passHref>
            <MUILink>par ici que ça se passe.</MUILink>
          </Link>
        </Typography>
        <RegisterForm
          onSubmit={withEmailAndPassword.signUp}
          loading={withEmailAndPassword.loading}
        />
        <Snackbar
          open={!!error.message}
          autoHideDuration={3000}
          onClose={() => error.reset()}
        >
          <Alert onClose={() => error.reset()} severity="error">
            {error?.message}
          </Alert>
        </Snackbar>
      </AuthCard>
    </Container>
  );
};

export default RegisterPage;
