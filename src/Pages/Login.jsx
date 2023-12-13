import { useNavigate } from "react-router-dom";
import Logo from "../Components/Shared/Logo";
import { $, hash, stringify } from "../js/cocktail";
import { showMarquee, success, warn } from "../js/global";
import styles from "../js/styles";
import PasswordInput from "../Components/Shared/PasswordInput";

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
            <Logo />
            <section className='h-[calc(100%-56px)] grid items-center'>
                <form className={styles.form} onSubmit={login} title="Login form">
                    <marquee className="w-full h-[2px] scale-0" id="marq" direction="right" scrollamount="50"><div className='h-[2px] w-[150px] bg-cyan-400'></div></marquee>
                    <h1 className={styles.title}>Login</h1>
                    <p id="warn" className={styles.warn}></p>
                    <input id="email" type="email" className={styles.input} autoComplete="true" placeholder="Email" title="Email input" />
                    <PasswordInput/>
                    <button className={styles.btn} type="submit" title="Login button">Login</button>
                </form>
            </section>
        </section>
    );
}

export default Login;