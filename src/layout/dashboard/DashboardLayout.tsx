import styles from "./styles.module.css";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "../dashboard-sidebar/DashboardSidebar";
import { DashboardHeader } from "../dashboard-header/DashboardHeader";





export const DashboardLayout = () => {
    
    return (
        <div className={styles.layout}>
            <div className={styles.sidebar}>
                <DashboardSidebar />
            </div>

            <div className={styles.header}>
                <DashboardHeader />
            </div>

            <main className={styles.content}>
                <div className={styles.container}>
                    {<Outlet />}
                </div>
            </main>
        </div>
    );
}