// PrivateRoute.js

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from './auth';

const PrivateRoute = ({ element: Element, ...rest }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }
    if (!isAdmin()) {
        return <Navigate to="/login" />;
    }
    return <Route {...rest} element={<Element />} />;
};

export default PrivateRoute;
