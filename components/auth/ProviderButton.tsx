import GithubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { styled } from "@mui/material";
import MUIButton from "@mui/material/Button";
import { ComponentProps, ReactNode } from "react";

export type SupportedProvider = "github" | "google";
type ProviderData = {
  label: string;
  icon: ReactNode;
  backgroundColor: string;
  color: string;
};

const PROVIDERS: {
  [key in SupportedProvider]: ProviderData;
} = {
  github: {
    label: "Se connecter via Github",
    color: "#ffffff",
    backgroundColor: "#000000",
    icon: <GithubIcon />,
  },
  google: {
    label: "Se connecter via Google",
    color: "#ffffff",
    backgroundColor: "#4285F4",
    icon: <GoogleIcon />,
  },
};

const Button = styled(MUIButton)<Pick<Props, "provider">>(({ provider }) => {
  const currentProvider = PROVIDERS[provider];

  return {
    backgroundColor: currentProvider.backgroundColor,
    color: currentProvider.color,
    "&:hover": {
      color: currentProvider.backgroundColor,
      backgroundColor: currentProvider.color,
    },
  };
});

type Props = {
  provider: SupportedProvider;
  loading?: boolean;
} & ComponentProps<typeof MUIButton>;

const ProviderButton = ({
  provider,
  loading = false,
  className = "provider-button",
  ...rest
}: Props) => {
  const { icon, label } = PROVIDERS[provider];

  return (
    <Button
      {...rest}
      className={className}
      startIcon={icon}
      variant="contained"
      provider={provider}
      disabled={loading}
    >
      {loading ? "Chargement..." : label}
    </Button>
  );
};

export default ProviderButton;
