import React, { type PropsWithChildren } from 'react'
import styles from "./styles.module.css";

export function FormContainer({ children }: PropsWithChildren) {
  return (
    <div className={styles.formContainer}>
      {children}
    </div>
  )
}
