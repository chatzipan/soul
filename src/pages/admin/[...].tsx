import React from "react";

import { Redirect, Router } from "@reach/router";

import Dashboard from "../../components/admin/Dashboard";
import Login from "../../components/admin/Login";
import Reservations from "../../components/admin/Reservations";
import Layout from "../../components/admin/layout/Layout";
import PrivateRoute from "../../components/shared/PrivateRoute";
import { AuthProvider } from "../../providers/AuthProvider";

const Admin = () => {
  return (
    <AuthProvider>
      <Layout>
        <Router basepath='/admin'>
          <PrivateRoute path='/reservations' component={Reservations} />
          <PrivateRoute path='/' component={Dashboard} />
          <Login path='/login' />
          <Redirect from='*' to='/' />
        </Router>
      </Layout>
    </AuthProvider>
  );
};

export default Admin;
