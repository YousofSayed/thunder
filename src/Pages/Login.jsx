import { useNavigate } from "react-router-dom";
import Logo from "../Components/Shared/Logo";
import { $, hash, stringify } from "../js/cocktail";
import { showMarquee, success, warn } from "../js/global";
import styles from "../js/styles";
import PasswordInput from "../Components/Shared/PasswordInput";
import { LogoContainer } from "../Components/Shared/LogoContainer";
import { Marquee } from "../Components/Shared/Marquee";

function Login() {
    const navigate = useNavigate();

    //Methods
    const login = async (e) => {
        try {
            e.preventDefault();
            showMarquee(true);
            if (!$('#email').value || !$('#pass').value) { $('#warn').textContent = `Fill all inputs`; return }
            const data = { email: $('#email').value.toLowerCase(), password: hash($('#pass').value) };

            showMarquee(false);
            if (res.ok) {
                localStorage.setItem('user', stringify(res.user));
                success(res.msg);
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                warn(res.msg)
            }
        } catch (error) {
            throw new Error(error.message)
        }

    }


    return (
        <section className='w-full h-full'>
            <LogoContainer><Logo /></LogoContainer>
            <section className='h-[calc(100%-56px)] grid items-center'>
                <form className={styles.form} onSubmit={login} title="Login form">
                    <Marquee />
                    <h1 className={styles.title}>Login</h1>
                    <p id="warn" className={styles.warn}></p>
                    <input id="email" type="email" className={styles.input} autoComplete="true" placeholder="Email" title="Email input" />
                    <PasswordInput />
                    <button className={styles.btn} type="submit" title="Login button">Login</button>
                </form>
            </section>
        </section>
    );
}

export default Login;