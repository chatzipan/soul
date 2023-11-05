// import original module declarations
import "styled-components";

import theme from "./theme";

type CustomTheme = typeof theme;

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme extends CustomTheme {}
}
