import React from "react";

import { Redirect, Router } from "@reach/router";

import Login from "../components/admin/Login";
import Profile from "../components/admin/Profile";
import Layout from "../components/shared/Layout";
import PrivateRoute from "../components/shared/PrivateRoute";
import { AuthProvider } from "../providers/AuthProvider";

const Admin = () => (
  <AuthProvider>
    <Layout>
      <Router>
        <PrivateRoute path='/admin/profile' component={Profile} />
        <Login path='/admin' />
      </Router>
    </Layout>
  </AuthProvider>
);

export default Admin;
