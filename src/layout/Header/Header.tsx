// Header.tsx
import { LogIn, LogOut, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Container from "../../components/Container/Container";
import IconButton from "../../components/IconButton/IconButton";
import { routes } from "../../constants/routes";
import { useAuthStore } from "../../features/auth/auth.store";
import { useCartStore } from "../../features/cart/cart.store";
import CartDropdown from "../../features/cart/components/CartDropdown/CartDropdown";
import styles from "./styles.module.css";
import { authService } from "@/features/auth/auth.service";
import Button from "@/components/Button/Button";
import { toast } from "sonner";

export default function Header() {
  const [openCart, setOpenCart] = useState(false);

  const { pathname } = useLocation();
  const isActive = (name: string) => {
    return pathname === name;
  };

  const totalItem = useCartStore((s) => s.totalItems());
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await authService.logout()
    logout();
    toast.success("Logged out successfully.")
  }

  return (
    <header className={styles.header}>
      <Container className={styles.headerInner}>
        <div className={styles.left}>
          <h1 className={styles.logo}>
            <span>Ja</span>Shop
          </h1>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li
              className={`${styles.navItem} ${isActive(routes.home) ? styles.active : ""}`}
            >
              <Link to={routes.home}>Home</Link>
            </li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <div
            style={{
              position: "relative",
            }}
          >
            <IconButton
              className={styles.iconButton}
              onClick={() => setOpenCart(!openCart)}
            >
              <ShoppingCart size={22} />
              <span className={styles.badge}>{totalItem}</span>
            </IconButton>
            {openCart && <CartDropdown onClose={() => setOpenCart(false)} />}
          </div>
          {user ? (
            <>
              <span>{user.fullname}</span>
              <IconButton onClick={handleLogout}>
                <LogOut size={22} />
              </IconButton>
            </>
          ) : (
            <Button to={routes.login} as={Link}>
              <LogIn size={22} />
              Login
            </Button>
          )}
        </div>

      </Container>

    </header>
  );
}
