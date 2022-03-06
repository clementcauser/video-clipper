import AuthCard from "@components/auth/AuthCard";
import ProviderButton from "@components/auth/ProviderButton";
import { LoginForm } from "@components/forms";
import { firebaseAuth } from "@firebase";
import Typography from "@mui/material/Typography";
import MUIContainer from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import { generateClassName } from "@utils";
import {
  useSignInWithGithub,
  useSignInWithGoogle,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { APP_NAME, Route } from "@constants";
import { GetServerSideProps } from "next";
import MUILink from "@mui/material/Link";
import Link from "next/link";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useEffect, useState } from "react";

const providerBoxClassName = generateClassName("provider-box", "login-page");

const Container = styled(MUIContainer)(({ theme }) => ({
  [`.${providerBoxClassName}`]: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(3),
    paddingBottom: theme.spacing(3),

    ".provider-button": {
      marginTop: theme.spacing(1),
    },
  },
  ".auth-card": {
    marginTop: theme.spacing(9),

    ".email-title": {
      marginBottom: theme.spacing(1),
    },
  },
}));

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [signInWithGithub, githubUser, githubLoading, githubError] =
    useSignInWithGithub(firebaseAuth);

  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(firebaseAuth);

  const [createUserWithEmailAndPassword, emailUser, emailLoading, emailError] =
    useSignInWithEmailAndPassword(firebaseAuth);

  useEffect(() => {
    if (githubError) {
      setErrorMessage(githubError.message);
    }
    if (googleError) {
      setErrorMessage(googleError.message);
    }
    if (emailError) {
      setErrorMessage(emailError.message);
    }
  }, [emailError, googleError, githubError]);

  return (
    <Container maxWidth="sm">
      <AuthCard title="Connexion">
        <Typography className="email-title">
          Connectez-vous avec vos identifiants pour accéder à{" "}
          <Typography component="span" fontWeight="bold">
            {APP_NAME}
          </Typography>
        </Typography>
        <LoginForm
          onSubmit={({ email, password }) =>
            createUserWithEmailAndPassword(email, password)
          }
          loading={emailLoading}
        />
        <div className={providerBoxClassName}>
          <Typography>
            ...ou connectez-vous avec votre compte Github ou Google
          </Typography>
          <ProviderButton
            fullWidth
            provider="github"
            onClick={() => signInWithGithub()}
            loading={githubLoading}
          />
          <ProviderButton
            fullWidth
            provider="google"
            onClick={() => signInWithGoogle()}
            loading={googleLoading}
          />
        </div>
        <Typography>
          Vous pouvez également créer votre compte{" "}
          <Link href={Route.REGISTER} passHref>
            <MUILink>en cliquant ici.</MUILink>
          </Link>
        </Typography>
      </AuthCard>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={3000}
        onClose={() => setErrorMessage(null)}
      >
        <Alert onClose={() => setErrorMessage(null)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const user = firebaseAuth.currentUser;

  if (user) {
    return { redirect: { destination: Route.HOME, permanent: false } };
  }

  return { props: {} };
};

export default LoginPage;
