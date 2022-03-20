import AuthCard from "@components/auth/AuthCard";
import ProviderButton from "@components/auth/ProviderButton";
import { LoginForm } from "@components/forms";
import { APP_NAME, defaultSnackbarDuration, Route } from "@constants";
import useAuth from "@hooks/useAuth";
import Alert from "@mui/material/Alert";
import MUIContainer from "@mui/material/Container";
import MUILink from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import isAuthenticated from "@utils/auth/isAuthenticated";
import generateClassName from "@utils/generateClassName";
import { GetServerSideProps } from "next";
import Link from "next/link";

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
  const { withEmailAndPassword, withGithub, withGoogle, error } = useAuth();

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
          onSubmit={withEmailAndPassword.signIn}
          loading={withEmailAndPassword.loading}
        />
        <div className={providerBoxClassName}>
          <Typography>
            ...ou connectez-vous avec votre compte Github ou Google
          </Typography>
          <ProviderButton
            fullWidth
            provider="github"
            onClick={() => withGithub.signIn()}
            loading={withGithub.loading}
          />
          <ProviderButton
            fullWidth
            provider="google"
            onClick={() => withGoogle.signIn()}
            loading={withGoogle.loading}
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
        open={!!error.message}
        autoHideDuration={defaultSnackbarDuration}
        onClose={() => error.reset()}
      >
        <Alert onClose={() => error.reset()} severity="error">
          {error.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const isUserAuthenticated = await isAuthenticated(ctx);

  // if user is already logged in then he gets redirected to the homepage
  if (isUserAuthenticated) {
    return {
      redirect: {
        destination: Route.HOME,
        permanent: false,
      },
    };
  }

  return { props: {} };
};
