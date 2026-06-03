import { Outlet } from "react-router-dom";

import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import { useAuthStore } from "@/features/auth/auth.store";
import AdminBar from "@/components/AdminBar/AdminBar";
import { routes } from "@/constants/routes";

export default function AppLayout() {

  const hasAdminRole = useAuthStore((state) => state.hasAdminRole());
  return (
    <>
      <Header />
      <main>
        {hasAdminRole && <AdminBar dashboardUrl={routes.dashboard}/>}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
