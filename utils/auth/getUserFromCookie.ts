import { firebaseCookieName } from "@constants";
import { verifyTokenId } from "@firebase/admin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { GetServerSidePropsContext } from "next";

export const getUserFromCookie = async (ctx: GetServerSidePropsContext) => {
  const user: DecodedIdToken = await verifyTokenId(
    ctx.req.cookies[firebaseCookieName]
  );

  return user;
};
