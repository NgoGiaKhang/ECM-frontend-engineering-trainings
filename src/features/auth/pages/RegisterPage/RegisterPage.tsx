import type { ApiErrorResponse } from "@/api/types";
import TextField from "@/components/FormField/TextField";
import SubmitButton from "@/components/SubmitButton";
import { routes } from "@/constants/routes";
import { email, required, minLength, Validator } from "@/core/validator";
import { LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../auth.service";
import styles from "./styles.module.css";
import Form from "../../../../components/FormField/Form";
import { PasswordStrength } from "./PasswordStrength";
import { toast } from "sonner";


const validator = new Validator({
    fullname: [required("Full name must not be empty")],
    email: [required("Email must not be empty"), email()],
    password: [
        required("Password must not be empty"),
        minLength(8),
    ],
    confirmPassword: [
        required("Confirm password must not be empty"),
        (value, getValue) => value === getValue("password") ? undefined : "Passwords do not match",
    ],
});

type FormData = {
    fullname: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const initialForm: FormData = {
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export default function RegisterPage() {
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [password, setPassword] = useState("");



    const handleRegister = async (data: FormData) => {
        try {
            await authService.register({
                fullname: data.fullname,
                email: data.email,
                password: data.password,
            });
            toast.success("Register success ! Please login to continue.")
            navigate(routes.login);
        } catch (e) {
            const apiError = e as ApiErrorResponse;
            setError(apiError.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Create account</h1>

                <p className={styles.subtitle}>
                    Create an account to start shopping
                </p>

                {error && (
                    <p className={styles.errorMessage}>
                        {error}
                    </p>
                )}

                <Form<FormData>
                    className={styles.form}
                    initialState={initialForm}
                    validator={validator}
                    onSubmit={handleRegister}
                >
                    <TextField
                        name="fullname"
                        placeholder="Full name"

                    />

                    <TextField
                        type="email"
                        name="email"
                        placeholder="Email"

                    />

                    <TextField
                        type="password"
                        name="password"
                        placeholder="Password"

                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <PasswordStrength password={password} />

                    <TextField
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"

                    />

                    <SubmitButton
                        className={styles.button}
                        loader={
                            <LoaderCircle className={styles.loader} />
                        }
                    >
                        Create account
                    </SubmitButton>
                </Form>

                <p className={styles.footerText}>
                    Already have an account?{" "}
                    <Link to={routes.login}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}