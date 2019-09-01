import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto&display=swap"
            rel="stylesheet"
            key="google-font-cabin"
          />
        </Head>

        <Component {...pageProps} />

        <style global jsx>{`
          body {
            background-color: #001c3d;
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
