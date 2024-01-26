const React = require("react");
const { ThemeProvider } = require("styled-components");
const Layout = require("./src/components/layout").default;
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
      crossoriginn='true'
    />,
    <link
      key='3'
      href='https://fonts.googleapis.com/css2?family=Cabin:ital@0;1&display=swap'
      rel='stylesheet'
    />,
    <link
      rel='preload'
      href='/fonts/AdriannaExtended-Thin.woff2'
      as='font'
      type='font/woff2'
      crossoriginn='anonymous'
      key='adriannaFont'
    />,
    <meta
      name='description'
      key='4'
      content='Experience the essence of Zurich at Soul Café – a cozy retreat for coffee aficionados and food lovers. Indulge in our aromatic specialty coffees, homemade pastries, and an exquisite selection of local wines. Nestled in the heart of the city, Soul is your destination for memorable flavors and vibrant community gatherings. Join us for a taste of local charm.'
    />,
  ]);
};
