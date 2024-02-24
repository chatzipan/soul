import React from "react";

import { Redirect, Router } from "@reach/router";

import Dashboard from "../../components/admin/Dashboard";
import Login from "../../components/admin/Login";
import Profile from "../../components/admin/Profile";
import Layout from "../../components/shared/Layout";
import PrivateRoute from "../../components/shared/PrivateRoute";
import { AuthProvider } from "../../providers/AuthProvider";

const Admin = () => (
  <AuthProvider>
    <Layout>
      <Router basepath='/admin'>
        <PrivateRoute path='/profile' component={Profile} />
        <PrivateRoute path='/' component={Dashboard} />
        <Login path='/login' />
        <Redirect from='*' to='/' />
      </Router>
    </Layout>
  </AuthProvider>
);

export default Admin;
