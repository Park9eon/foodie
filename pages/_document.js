/* eslint-disable react/no-danger */
import React from 'react';
import JssProvider from 'react-jss/lib/JssProvider';
import Document, { Head, Main, NextScript } from 'next/document';
import htmlescape from 'htmlescape';
import getContext from '../lib/getContext';

const { GA_TRACKING_ID, StripePublishableKey, GOOGLE_API_KEY } = process.env;
const env = {
  GOOGLE_API_KEY,
  GA_TRACKING_ID,
  StripePublishableKey,
};

// console.log(GA_TRACKING_ID);

class MyDocument extends Document {
  render() {
    return (
      <html lang="ko">
      <Head>
        <meta charSet="utf-8"/>
        <meta name="viewport"
              content="width=device-width, initial-scale=1.0"/>
        <meta name="theme-color"
              content="#aa2e25"/>
        <style>
          {`
              a, a:focus {
                font-weight: 400;
                color: #1565C0;
                text-decoration: none;
                outline: none
              }
              a:hover, button:hover {
                opacity: 0.75;
                cursor: pointer
              }
              blockquote {
                padding: 0 1em;
                color: #555;
                border-left: 0.25em solid #dfe2e5;
              }
              pre {
                display:block;
                overflow-x:auto;
                padding:0.5em;
                background:#FFF;
                color: #000;
                border: 1px solid #ddd;
                font-size: 14px;
              }
              code {
                font-size: 14px;
                background: #FFF;
              }
            `}
        </style>
        <script async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}/>
        <script async
                src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`}/>
        <script dangerouslySetInnerHTML={{
          __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){
                  dataLayer.push(arguments);
                }
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}');
              `,
        }}/>
      </Head>
      <body>
      <Main/>
      <script dangerouslySetInnerHTML={{ __html: `__ENV__ = ${htmlescape(env)}` }}/>
      <NextScript/>
      </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = (ctx) => {
  const pageContext = getContext();
  const page = ctx.renderPage((Component) => (props) => (
    <JssProvider registry={pageContext.sheetsRegistry}
                 generateClassName={pageContext.generateClassName}>
      <Component pageContext={pageContext} {...props}/>
    </JssProvider>
  ));

  return {
    ...page,
    pageContext,
    styles: (
      <style id="jss-server-side"
             dangerouslySetInnerHTML={{ __html: pageContext.sheetsRegistry.toString() }}/>
    ),
  };
};

export default MyDocument;
