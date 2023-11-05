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
