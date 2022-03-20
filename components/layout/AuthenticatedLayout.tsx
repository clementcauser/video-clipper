import { APP_NAME } from "@constants";
import LogoutIcon from "@mui/icons-material/Logout";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useAuth from "@hooks/useAuth";

import { FC } from "react";

const AuthenticatedLayout: FC = ({ children }) => {
  const { signOut } = useAuth();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {APP_NAME}
          </Typography>
          <div>
            <Tooltip title="Se déconnecter">
              <IconButton
                aria-label="Se déconnecter"
                onClick={() => signOut()}
                color="inherit"
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Paper sx={{ marginTop: 3, padding: 3 }}>{children}</Paper>
      </Container>
    </>
  );
};

export default AuthenticatedLayout;
