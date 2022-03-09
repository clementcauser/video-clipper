import { Button } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getUserFromCookie, withPrivateServerSideProps } from "@utils/auth";
import { useAuth } from "context";
import { GetServerSideProps } from "next";

type Props = {
  userName?: string;
};

const Homepage = ({ userName }: Props) => {
  const { signOut } = useAuth();

  return (
    <Container maxWidth="sm">
      <Typography>Bienvenue {userName} !</Typography>
      <Button onClick={() => signOut()}>Déconnexion</Button>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<Props> =
  withPrivateServerSideProps(async (ctx) => {
    const user = await getUserFromCookie(ctx);

    try {
      return { props: { userName: user.email } };
    } catch (error) {
      return { props: {} };
    }
  });

export default Homepage;
