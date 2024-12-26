import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Preconnect to domains */}
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          
          {/* Preload critical fonts */}
          <link
            rel="preload"
            as="style"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            media="print"
            onLoad={() => {
              const link = document.querySelector('link[href*="Inter"]');
              if (link) {
                (link as HTMLLinkElement).media = 'all';
              }
            }}
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap"
            rel="stylesheet"
          />
          
          {/* Preload critical assets */}
          <link
            rel="preload"
            href="/images/logo.png"
            as="image"
            type="image/png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
