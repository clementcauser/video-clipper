import { firebaseCookieName } from "@constants";
import { verifyTokenId } from "@firebase/admin";
import { GetServerSidePropsContext } from "next";

export const getUserFromCookie = async (ctx: GetServerSidePropsContext) => {
  const user = await verifyTokenId(ctx.req.cookies[firebaseCookieName]);

  return user;
};
