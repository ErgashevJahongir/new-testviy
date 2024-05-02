import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "@/components/layout";
import ErrorPage from "@/ErrorPage";
import ProductsTable from "@/page/Products";
import CategoriesTable from "./page/Categories";

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
