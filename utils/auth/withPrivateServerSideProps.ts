import { Route } from "@constants";
import { GetServerSideProps } from "next";
import isAuthenticated from "./isAuthenticated";

/**
 * This function wraps a page's GetServerSideProps function. It passes the
 * `redirect` object if the user needs to authenticate, and calls the wrapped
 * function otherwise.
 */
const withPrivateServerSideProps = (
  getServerSidePropsFunc?: GetServerSideProps
): GetServerSideProps => {
  const withPrivateServerSideProps: GetServerSideProps = async (ctx) => {
    const _isAuthenticated = await isAuthenticated(ctx);

    // If not authenticated, we return a redirect object that instructs
    // Next.js to redirect to our login page.
    if (!_isAuthenticated) {
      return {
        redirect: {
          destination: Route.LOGIN,
          permanent: false,
        },
      };
    }

    if (getServerSidePropsFunc) {
      return await getServerSidePropsFunc(ctx);
    }
    return { props: {} };
  };

  return withPrivateServerSideProps;
};

export default withPrivateServerSideProps;
