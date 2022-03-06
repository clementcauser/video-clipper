import { Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { generateClassName } from "@utils";
import { ComponentPropsWithoutRef, FC } from "react";

const titleClassName = generateClassName("title", "auth-card");

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  [`& > .${titleClassName}`]: {
    marginBottom: theme.spacing(3),
  },
}));

type Props = {
  title: string;
} & ComponentPropsWithoutRef<typeof Paper>;

const AuthCard: FC<Props> = ({
  title,
  children,
  className = "auth-card",
  ...paperProps
}) => (
  <Card className={className} {...paperProps}>
    <Typography className={titleClassName} variant="h4" component="h1">
      {title}
    </Typography>
    {children}
  </Card>
);

export default AuthCard;
