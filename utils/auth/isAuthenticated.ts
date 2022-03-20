import { firebaseCookieName } from "@constants";
import { verifyTokenId } from "@firebase/admin";
import { GetServerSidePropsContext } from "next";
import nookies from "nookies";

const isAuthenticated = async (
  ctx: GetServerSidePropsContext
): Promise<boolean> => {
  const cookies = nookies.get(ctx);
  console.log("COOKIES from ISAUTHENTICATED", cookies[firebaseCookieName]);
  if (cookies[firebaseCookieName]) {
    try {
      const user = await verifyTokenId(cookies[firebaseCookieName]);
      console.log("🚀 ~ file: isAuthenticated.ts ~ line 14 ~ user", user);

      // An anonymous user may have a UID, but authenticated users must have an
      // account (an email address).
      return !!user.email;
    } catch (err) {
      return false;
    }
  }

  return false;
};

export default isAuthenticated;
