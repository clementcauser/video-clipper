import { Route } from "@constants";
import { firebaseAuth } from "@firebase";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { User } from "firebase/auth";
import { GetServerSideProps } from "next";

type Props = {
  user: User;
};

const Homepage = ({ user }: Props) => {
  return (
    <Container maxWidth="sm">
      <Typography>Bienvenue {user.displayName} !</Typography>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const user = firebaseAuth.currentUser;

  if (!user) {
    return { redirect: { destination: Route.LOGIN, permanent: false } };
  }

  return {
    props: {
      user,
    },
  };
};

export default Homepage;
