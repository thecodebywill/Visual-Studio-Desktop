import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import styles from "./root.module.css";
import { Outlet } from "@tanstack/react-router";
import Bubbles from "../bubbles";
import Navbar from "../layout/navbar";
import Footer from "../footer";
import { useRouter } from "@tanstack/react-router";

export const Root = () => {
  const router = useRouter();
  const isDashboard = router.state.location.pathname === "/dashboard";
  return (
    <>
      <div className={styles.rootContainer}>
        {!isDashboard && <Navbar />}
        <div className={styles.body}>
          <Outlet />
        </div>
        <Footer />
      </div>
      <Bubbles />
      <TanStackRouterDevtools />
    </>
  );
};
