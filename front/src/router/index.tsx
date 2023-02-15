import React, { Suspense } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import {
  createBrowserRouter
} from 'react-router-dom';
import { Root } from '../components/Root';
import { ROUTES } from './routerList';
import { LoginPage } from '../pages/Login';
import { RegisterPage } from '../pages/Register';
import { SettingsPage } from '../pages/Settings';
import { CreateOrgPage } from '../pages/CreateOrg';
import { CreatePostPage } from '../pages/CreatePost';
import { HomePage } from '../pages/Home';
import { CreateReviewPage } from '../pages/CreateReview';
import { OrgPage } from '../pages/Org';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <CircularProgress />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage/>
      },
      {
        path: ROUTES.LOGIN,
        element: <LoginPage/>
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage/>
      },
      {
        path: ROUTES.PROFILE_SETTINGS,
        element: <SettingsPage/>
      },
      {
        path: ROUTES.CREATE_ORG,
        element: <CreateOrgPage/>
      },
      {
        path: ROUTES.CREATE_POST,
        element: <CreatePostPage/>
      },
      {
        path: `${ROUTES.REVIEW_CREATE}/:postId`,
        element: <CreateReviewPage/>
      },
      {
        path: `${ROUTES.ORG}/:orgId`,
        element: <OrgPage/>
      }
    ]
  }
])
