import AuthCard from "@components/auth/AuthCard";
import { RegisterForm } from "@components/forms";
import { Route } from "@constants";
import { firebaseAuth } from "@firebase";
import { styled } from "@mui/material";
import Alert from "@mui/material/Alert";
import MUIContainer from "@mui/material/Container";
import MUILink from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

const Container = styled(MUIContainer)(({ theme }) => ({
  ".auth-card": {
    marginTop: theme.spacing(9),
    ".email-title": {
      marginBottom: theme.spacing(1),
    },
  },
}));

const RegisterPage = () => {
  const router = useRouter();
  const [showError, setShowError] = useState(false);

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(firebaseAuth);

  useEffect(() => {
    // if the request has failed then we show up an error snackbar
    if (error) {
      setShowError(true);
    }
  }, [error]);

  useEffect(() => {
    // if user is truthy then user creation has been successfuly done
    // so we redirect the user to the homepage
    if (user) {
      router.push(Route.HOME);
    }
  }, [user, router]);

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
          onSubmit={({ email, password }) =>
            createUserWithEmailAndPassword(email, password)
          }
          loading={loading}
        />
        <Snackbar
          open={showError}
          autoHideDuration={3000}
          onClose={() => setShowError(false)}
        >
          <Alert onClose={() => setShowError(false)} severity="error">
            {error?.message}
          </Alert>
        </Snackbar>
      </AuthCard>
    </Container>
  );
};

export default RegisterPage;
