import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
//import AuthContext from "./context/AuthProvider";
import styles from './auth.module.css';
import { useAuth } from "../../hooks/useAuth";
import axios from '../../services/api/axios';

const LOGIN_URL = '/auth';  //delete
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;




const Login = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const emailRef = useRef<HTMLInputElement | null>(null);
    const errRef = useRef<HTMLParagraphElement | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, password])

   
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
            e.preventDefault();

            setErrMsg("");

            if (!EMAIL_REGEX.test(email)) {
                setErrMsg("Будь ласка, введіть коректний email.");
                errRef.current?.focus();
                return;
            }

            if (!password) {
                setErrMsg("Введіть пароль.");
                errRef.current?.focus();
                return;
            }

            try {
                const response = await axios.post(
                    LOGIN_URL,
                    { email, password },
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );

                console.log("LOGIN response:", response.data);

                const userFromResponse = response?.data?.user;
                const accessToken = response?.data?.accessToken;

                const rolesFromResponse = userFromResponse?.roles;
                const roles = Array.isArray(rolesFromResponse) ? rolesFromResponse : [];

                setAuth({
                    user: {
                        id: userFromResponse?.id ?? "temp-id",
                        username: userFromResponse?.username ?? email.split("@")[0],
                        email: userFromResponse?.email ?? email,
                        roles,
                    },
                    accessToken,
                });

                setEmail("");
                setPassword("");
                navigate("/", { replace: true });

            } catch (err: any) {
                
                if (!err?.response) {
                    setErrMsg("Сервер не відповідає. Спробуйте пізніше.");
                } else if (err.response.status === 400) {
                    setErrMsg("Введіть ім’я користувача та пароль.");
                } else if (err.response.status === 401) {
                    setErrMsg("Невірне ім’я користувача або пароль.");
                } else {
                    setErrMsg("Помилка входу. Спробуйте ще раз.");
                }

                
                errRef.current?.focus();
            }
    };


    return (
        <div className={styles.layout}>
            <section className={styles.card}>
                <p ref={errRef} className={errMsg ? styles.errmsg : styles.offscreen} aria-live="assertive">{errMsg}</p>
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formFields}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                ref={emailRef}
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                        </div>
                    </div>
                    <button>Sign In</button>
                </form>
                <p>
                    Need an Account?<br />
                    <span className="line">
                        <Link to="/register" className={styles.link}>Sign Up</Link>
                    </span>
                </p>
            </section>
        </div>
    )
}

export default Login





    