import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "@/components/layout";

const ErrorPage = lazy(() => {
  return import("@/ErrorPage");
});
const ProductsTable = lazy(() => {
  return import("@/page/Products");
});
const CategoriesTable = lazy(() => {
  return import("@/page/Categories");
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <ProductsTable />,
      },
      {
        path: "category",
        element: <CategoriesTable />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
