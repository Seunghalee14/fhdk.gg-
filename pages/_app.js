import "../css/index.css";
import Head from "next/head";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import Cookie from "js-cookie";
import { reduxWrapper } from "store";
import NextNProgress from "nextjs-progressbar";
import API from "api";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const handleRouteChange = (url) => {
    window.gtag("config", "G-RW98WBW5QK", {
      page_path: url,
    });
  };

  useEffect(() => {
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    async function fetchAndSetUser() {
      const data = await API.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
    }
    const token = Cookie.get("token");
    if (token) {
      fetchAndSetUser();
    }
  }, []);

  const userHandler = (user) => {
    setUser(user);
  };

  return (
    <Layout>
      <AppContext.Provider
        value={{
          user: user,
          isAuthenticated: !!user,
          setUser: userHandler,
        }}
      >
        <Head>
          <title>Lostar</title>
          <meta name="Description" content="로스트아크 떠돌이 상인 제보" />
        </Head>
        <NextNProgress
          color="#f1de08"
          startPosition={0.3}
          stopDelayMs={200}
          height={2}
          showOnShallow={true}
        />
        <Component {...pageProps} />
      </AppContext.Provider>
    </Layout>
  );
}

export default reduxWrapper.withRedux(MyApp);
