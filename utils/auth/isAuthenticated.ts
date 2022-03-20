import { firebaseCookieName } from "@constants";
import { verifyTokenId } from "@firebase/admin";
import { GetServerSidePropsContext } from "next";
import nookies from "nookies";

const isAuthenticated = async (
  ctx: GetServerSidePropsContext
): Promise<boolean> => {
  const cookies = nookies.get(ctx);

  if (cookies[firebaseCookieName]) {
    try {
      const user = await verifyTokenId(cookies[firebaseCookieName]);

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
