const React = require("react");
const { ThemeProvider } = require("styled-components");
const Layout = require("./src/components/shared/Layout").default;
const Theme = require("./src/theme").default;

exports.wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get

  // including location, data, etc - you don't need to pass it
  return <Layout {...props}>{element}</Layout>;
};

exports.wrapRootElement = ({ element }) => {
  return <ThemeProvider theme={Theme}>{element}</ThemeProvider>;
};

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <html key='0' lang='en' />,
    <link key='1' rel='preconnect' href='https://fonts.googleapis.com' />,
    <link
      key='2'
      rel='preconnect'
      href='https://fonts.gstatic.com'
      crossOrigin='true'
    />,
    <link
      key='3'
      href='https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
      rel='stylesheet'
      async
      defer
    />,
    <link
      rel='preload'
      href='/fonts/AdriannaExtended-Thin.woff2'
      as='font'
      type='font/woff2'
      crossOrigin='anonymous'
      key='adriannaFont'
    />,
    <meta
      name='description'
      key='4'
      content="Soul Café: Zurich's all-day kitchen bar. Enjoy brunch, business lunches, refined dinners, cocktails, and wines in a warm, vibrant city atmosphere."
    />,
  ]);
};
