import App, { Container } from "next/app";
import Head from "next/head";
import React from "react";
import Header from "../src/components/Header";

class MyApp extends App {
  static async getInitialProps({ ctx }) {
    const { name, rate, percentile } = ctx.query;

    const pageProps = {
      path: ctx.asPath,
      name,
      rate,
      percentile
    };

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Head>
          <title>
            Private Benchmarks
          </title>
          <meta name="Description" content="Compare your data with others privately and secure." />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto&display=swap"
            rel="stylesheet"
            key="google-font-cabin"
          />
        </Head>
        <Header path={pageProps.path} />
        <Component {...pageProps} />
        <style jsx global>{`
          body {
            background-color: #001c3d;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: none;
            padding: none;
            font-family: "Roboto", sans-serif;
          }
        `}</style>
      </Container>
    );
  }
}

export default MyApp;
