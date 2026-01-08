import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { faCheck, faTimes, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from './auth.module.css';
import axios from '../../services/api/axios';

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const REGISTER_URL = '/register';  //delete

 const Register = () => {
    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement | null>(null);
    const errRef = useRef<HTMLParagraphElement | null>(null);

    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [usernameFocus, setUsernameFocus] = useState(false);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [confirmFocus, setConfirmFocus] = useState(false);

    const [errMsg, setErrMsg] = useState("");
    
    useEffect(() => {
        if (usernameRef.current) {
        usernameRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setValidUsername(USERNAME_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password));
        setValidMatch(password === confirmPassword);
    }, [password, confirmPassword]);

    useEffect(() => {
        setErrMsg("");
    }, [username, email, password, confirmPassword]);


//     const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
//         e.preventDefault();

//     const v1 = USERNAME_REGEX.test(username);
//     const v2 = PASSWORD_REGEX.test(password);
//     const v3 = EMAIL_REGEX.test(email);

//     if (!v1 || !v2 || !v3) {
//         setErrMsg("Invalid Entry");
//         return;
//     }

//     // ⬇️ імітація успішної реєстрації
//     //setSuccess(true);

//     setUsername("");
//     setEmail("");
//     setPassword("");
//     setConfirmPassword("");
//     navigate("/", { replace: true });
//    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
        
        const v1 = USERNAME_REGEX.test(username);
        const v2 = PASSWORD_REGEX.test(password);
        const v3 = EMAIL_REGEX.test(email);
        if (!v1 || !v2 || !v3) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                { username, password, email },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response.data);
            console.log(JSON.stringify(response))
                                     
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            navigate("/login", { replace: true });
            
        } catch (err: any) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current?.focus();
        }
    }

    return (
        <div className={styles.layout}>    
            <section className={styles.card}>
                <p ref={errRef} className={errMsg ? styles.errmsg : styles.offscreen} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formFields}>
                        {/* Username */}
                        <div className={styles.formGroup}>
                            <label htmlFor="username">
                                Username:
                                <FontAwesomeIcon icon={faCheck} className={validUsername ? styles.valid : styles.hide} />
                                <FontAwesomeIcon icon={faTimes} className={validUsername || !username ? styles.hide : styles.invalid} />
                            </label>
                            <input
                                type="text"
                                id="username"
                                ref={usernameRef}
                                autoComplete="off"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                required
                                aria-invalid={validUsername ? "false" : "true"}
                                aria-describedby="uidnote"
                                onFocus={() => setUsernameFocus(true)}
                                onBlur={() => setUsernameFocus(false)}
                            />
                            <p id="uidnote" className={usernameFocus && username && !validUsername ? styles.instructions : styles.offscreen}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Від 4 до 24 символів.<br />
                                Повинно починатися з літери.<br />
                                Дозволені літери, цифри, підкреслення та дефіси.
                            </p>
                        </div>

                        {/* Email */}
                        <div className={styles.formGroup}>
                            <label htmlFor="email">
                                Email:
                                <FontAwesomeIcon icon={faCheck} className={validEmail ? styles.valid : styles.hide} />
                                <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? styles.hide : styles.invalid} />
                            </label>
                            <input
                                type="email"
                                id="email"
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                                aria-invalid={validEmail ? "false" : "true"}
                                aria-describedby="emailnote"
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                            />
                            <p
                                id="emailnote"
                                className={ emailFocus && email && !validEmail ? styles.instructions : styles.offscreen }
                            >
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Введіть коректну адресу електронної пошти.
                            </p>
                        </div>

                        {/* Password */}
                        <div className={styles.formGroup}>
                            <label htmlFor="password">
                                Password:
                                <FontAwesomeIcon icon={faCheck} className={validPassword ? styles.valid : styles.hide} />
                                <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? styles.hide : styles.invalid} />
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                                aria-invalid={validPassword ? "false" : "true"}
                                aria-describedby="pwdnote"
                                onFocus={() => setPasswordFocus(true)}
                                onBlur={() => setPasswordFocus(false)}
                            />
                                
                            <p id="pwdnote" className={passwordFocus && !validPassword ? styles.instructions : styles.offscreen}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Від 8 до 24 символів.<br />
                                Повинно містити великі та малі літери, цифру та спеціальний символ.<br />
                                Дозволені спеціальні символи: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div className={styles.formGroup}>
                            <label htmlFor="confirm_pwd">
                                Confirm Password:
                                <FontAwesomeIcon icon={faCheck} className={validMatch && confirmPassword ? styles.valid : styles.hide} />
                                <FontAwesomeIcon icon={faTimes} className={validMatch || !confirmPassword ? styles.hide : styles.invalid} />
                            </label>
                            <input
                                type="password"
                                id="confirm_pwd"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                                required
                                aria-invalid={validMatch ? "false" : "true"}
                                aria-describedby="confirmnote"
                                onFocus={() => setConfirmFocus(true)}
                                onBlur={() => setConfirmFocus(false)}
                            />
                            <p id="confirmnote" className={confirmFocus && !validMatch ? styles.instructions : styles.offscreen}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Повинно збігатися з першим полем пароля.
                            </p>
                        </div>

                    </div>
                        <button disabled={ !validUsername || !validEmail || !validPassword || !validMatch ? true : false}>Sign Up</button>
                </form>
                 <p>
                    Already registered?
                    <br/>
                    <span className="line">
                        <Link to="/login" className={styles.link}>Sign In</Link>
                    </span>
                </p>
            </section>
        </div>
        
    )
}

export default Register
