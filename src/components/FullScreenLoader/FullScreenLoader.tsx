import { LoaderCircle } from "lucide-react";

import styles from "./styles.module.css";

type Props = {
  text?: string;
};

export function FullScreenLoader({
  text = "Loading...",
}: Props) {
  return (
    <div
      className={styles.overlay}
      aria-busy="true"
      aria-label={text}
    >
      <div className={styles.inner}>
        <LoaderCircle
          size={40}
          className={styles.spinner}
        />

        <div className={styles.text}>
          {text}
        </div>
      </div>
    </div>
  );
}