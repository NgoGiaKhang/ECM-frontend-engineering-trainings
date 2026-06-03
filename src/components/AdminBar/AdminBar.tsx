import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

import styles from "./styles.module.css";

type Props = {
  dashboardUrl?: string;
};

export default function AdminBar({
  dashboardUrl = "/dashboard",
}: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.left}>
          <Shield size={16} />

          <span>
            Admin Mode
          </span>
        </div>

        <Link
          to={dashboardUrl}
          className={styles.link}
        >
          Open Dashboard
        </Link>
      </div>
    </div>
  );
}