import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import ErrorPage from "./error-page";

import Root, { loader as rootLoader, action as rootAction } from "./routes/root";
import Index from "./routes/index";
import Place, {loader as placeLoader, action as placeAction} from "./routes/places";
import EditPlace, { action as editAction} from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [{
      errorElement: <ErrorPage />,
      children: [
        {index: true, element: <Index />},  
        {
          path: "places/:placeId",
          loader: placeLoader,
          action: placeAction,
          element: <Place />,
        },
        {
          path: "places/:placeId/edit",
          element: <EditPlace />,
          loader: placeLoader,
          action: editAction
        },
        {
          path: "places/:placeId/destroy",
          action: destroyAction,
          errorElement: <div>Oops! There was an error.</div>,
        },
      ]
    }]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
