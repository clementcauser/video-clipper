import { Route } from "@constants";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";
import { getUserFromCookie } from "./getUserFromCookie";

/**
 * This function wraps a page's GetServerSideProps function. It passes the
 * `redirect` object if the user needs to authenticate, and calls the wrapped
 * function otherwise.
 */
const withPrivateServerSideProps =
  <
    T extends { [key: string]: any } = { [key: string]: any },
    Q extends ParsedUrlQuery = ParsedUrlQuery,
    D extends PreviewData = PreviewData
  >(
    getServerSidePropsFunc?: (
      ctx: GetServerSidePropsContext<Q, D> & { user: DecodedIdToken }
    ) => Promise<GetServerSidePropsResult<T>>
  ): GetServerSideProps<T | { user: DecodedIdToken }, Q, D> =>
  async (ctx) => {
    const user = await getUserFromCookie(ctx);

    // If not authenticated, we return a redirect object that instructs
    // Next.js to redirect to our login page.
    if (!user?.email) {
      return {
        redirect: {
          destination: Route.LOGIN,
          permanent: false,
        },
      };
    }

    if (getServerSidePropsFunc) {
      return await getServerSidePropsFunc({
        ...ctx,
        user,
      });
    }
    return { props: { user } };
  };

export default withPrivateServerSideProps;
