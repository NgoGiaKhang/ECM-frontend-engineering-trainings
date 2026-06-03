import styles from "./styles.module.css";

type PasswordStrengthProps = {
    password: string;
};

function calculateScore(password: string): number {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return Math.min(score, 5);
}

function getLabel(score: number): string {
    switch (score) {
        case 0:
        case 1:
            return "Very Weak";
        case 2:
            return "Weak";
        case 3:
            return "Medium";
        case 4:
            return "Strong";
        default:
            return "Very Strong";
    }
}

export function PasswordStrength({
    password,
}: PasswordStrengthProps) {
    if (!password) {
        return null;
    }

    const score = calculateScore(password);

    return (
        <div className={styles.passwordStrength}>
            <div className={styles.bar}>
                {Array.from({ length: 5 }, (_, index) => (
                    <span
                        key={index}
                        className={[
                            styles.segment,
                            index < score ? styles.active : "",
                            styles[`score${score}`],
                        ].join(" ")}
                    />
                ))}
            </div>

            <span
                className={`${styles.label} ${styles[`score${score}`]}`}
            >
                {getLabel(score)}
            </span>
        </div>
    );
}