import { useNavigate } from "react-router-dom";
import Logo from "../Components/Logo";
import { $, hash, stringify } from "../js/cocktail";
import { getReqFromGs, showMarquee, success, warn } from "../js/global";
import styles from "../js/styles";

function Login() {
    const navigate = useNavigate();

    //Methods
    const login = async (e) => {
        try {
            e.preventDefault();
            showMarquee(true);
            const data = { email: $('#email').value.toLowerCase(), password: hash($('#pass').value) };
            if (!data.email || !data.password) { $('#warn').textContent = `Fill all inputs`; return }

            // const isUser = await filterData({
            //     dbName: 'Users',
            //     value: $('#email').value,
            //     boolean: true
            // });

            // console.log(isUser);

            const res = await getReqFromGs({
                type: 'login',
                sheetName: 'Users',
                dataJson: encodeURIComponent(stringify(data))
            })

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

    const showAndHidePass = (e, inputRoot) => {
        if (e.target.classList.contains('fa-eye-slash')) {
            e.target.classList.replace('fa-eye-slash', 'fa-eye');
            $(inputRoot).type = 'text';
        }
        else {
            e.target.classList.replace('fa-eye', 'fa-eye-slash');
            $(inputRoot).type = 'password';
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
                    <div className="w-full relative"><input id="pass" type="password" className={styles.input} autoComplete='true' placeholder="Password" title="Password input" /><i className={styles.eyeHidePass} onClick={(e) => { showAndHidePass(e, '#pass') }}></i></div>
                    <button className={styles.btn} type="submit" title="Login button">Login</button>
                </form>
            </section>
        </section>
    );
}

export default Login;