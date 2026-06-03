import { Route, Routes } from "react-router-dom";

import { routes } from "./constants/routes";
import LoginPage from "./features/auth/pages/LoginPage/LoginPage";
import CartPage from "./features/cart/pages/CartPage";
import HomePage from "./features/home/HomePage";
import ProductDetailPage from "./features/product/pages/ProductDetailPage/ProductDetailPage";
import { NotFoundPage } from "./layout/404";
import AppLayout from "./layout/AppLayout";
import UnknownErrorPage from "./layout/Unknown/UnknownErrorPage";
import { ProductPage } from "./features/dashboard/product/pages/ProductPage/ProductPage";
import { DashboardLayout } from "./layout/dashboard/DashboardLayout";
import { ProductFormPage } from "./features/dashboard/product/pages/CreateProductPage";
import { UpdateProductPage } from "./features/dashboard/product/pages/UpdateProductPage";
import { AuthInitializer } from "./features/auth/AuthInitializer";
import Authorize from "./features/auth/AuthorizeRoute";
import RegisterPage from "./features/auth/pages/RegisterPage/RegisterPage";

function App() {
  return (
    <AuthInitializer>
      <Routes>
        <Route element={<AppLayout />} errorElement={<UnknownErrorPage />}>
          <Route path={routes.home} element={<HomePage />} />
          <Route path={routes.productDetails} element={<ProductDetailPage />} />
          <Route path={routes.cart} element={<CartPage />} />
          <Route path={routes.login} element={<LoginPage />} />
          <Route path={routes.register} element={<RegisterPage />} />
          <Route path={routes.error} element={<UnknownErrorPage />}></Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route element={<Authorize minimum="moderator" />} errorElement={<UnknownErrorPage />}>
          <Route element={<DashboardLayout />} errorElement={<UnknownErrorPage />}>
            <Route path={routes.createProduct} element={<ProductFormPage />} />
            <Route path={routes.manageProducts} element={<ProductPage />} />
            <Route path={routes.updateProducts} element={<UpdateProductPage />} />
            <Route path={routes.adminNotFound} element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthInitializer>
  );
}

export default App;
