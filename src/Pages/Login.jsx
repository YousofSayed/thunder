import { useNavigate } from "react-router-dom";
import Logo from "../Components/Logo";
import { $, hash } from "../js/cocktail";
import { filterData } from "../js/db";
import { success, warn } from "../js/global";
import styles from "../js/styles";

function Login() {
    const navigate = useNavigate();

    //Methods
    const login = async (e) => {
        try {
            e.preventDefault();
            if (!$('#email').value || !$('#pass').value) { $('#warn').textContent = `Fill all inputs`; return }

            const isUser = await filterData({
                dbName:'Users',
                value:$('#email').value ,
                boolean:true
            });

            console.log(isUser);
            // if(isUser.ok && isUser.data[0].password == hash($('#pass').value)){
            //     success(`Successfully Login`);
            //     setTimeout(() => {
            //         navigate('/');
            //     }, 1500);
            // }else{
            //     warn(`Email or Password is wrong`)
            // }
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
        <>
            <Logo />
            <form className={styles.form} onSubmit={login} title="Login form">
                <h1 className={styles.title}>Login</h1>
                <p id="warn" className={styles.warn}></p>
                <input id="email" type="email" className={styles.input} autoComplete="true" placeholder="Email" title="Email input" />
                <div className="w-full relative"><input id="pass" type="password" className={styles.input} autoComplete='true' placeholder="Password" title="Password input" /><i className={styles.eyeHidePass} onClick={(e) => { showAndHidePass(e, '#pass') }}></i></div>
                <button className={styles.btn} type="submit" title="Login button">Login</button>
            </form>
        </>
    );
}

export default Login;