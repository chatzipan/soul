import React from "react";

import { navigate } from "gatsby";

import { RouteComponentProps } from "@reach/router";

import { useAuth } from "../../hooks/useAuth";

const PrivateRoute = ({
  component: Component,
  location,
  ...rest
}: RouteComponentProps & {
  component: React.FC<RouteComponentProps>;
}) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn && location?.pathname !== "/login") {
    navigate("/admin/login");
    return null;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
