import React from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import LandingPage from './Landing';
import Dashboard from './Dashboard';
import LoginForm from './LoginForm';
import ClaimPlate from './ClaimPlate';
import PublicPlate from './PublicPlate';
import MyPlatesList from './MyPlates';
import MyPlate from './MyPlate';
import About from './About';
import MyReviews from './MyReviews';
import '../styles/App.css';

import { Auth0Provider } from "../auth/Auth0Provider";

const routesArray = [
  { path: "/", element: <LandingPage /> },
  // { path: "/register", element: <RegistrationPage /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/login", element: <LoginForm /> },
  { path: "/plate", element: <PublicPlate /> },
  { path: "/plate/id/:id", element: <PublicPlate /> },
  { path: "/about", element: <About /> },
  { path: "/claim-plate", element: <ClaimPlate /> },
  { path: "/my-plates", element: <MyPlatesList /> },
  { path: "/my-plates/id/:id", element: <MyPlate /> },
  { path: "/my-reviews", element: <MyReviews /> }
];

const routes = createRoutesFromElements(
  <Route element={<Auth0Provider /> }>
    {routesArray.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ))}
  </Route>
);

const router = createBrowserRouter(routes);

export const App = () => (<RouterProvider router={router} />);
