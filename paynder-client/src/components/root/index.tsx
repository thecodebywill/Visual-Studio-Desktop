import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import styles from "./root.module.css";
import { Outlet } from "@tanstack/react-router";
import Bubbles from "../bubbles";
import Navbar from "../layout/navbar";
import Footer from "../footer";

export const Root = () => {
  return (
    <>
      <div className={styles.rootContainer}>
        <Navbar />
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
