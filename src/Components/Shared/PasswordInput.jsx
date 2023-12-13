import styles from '../../js/styles';
import { $ } from '../../js/cocktail';

function PasswordInput() {
    
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
        <section className="w-full relative">
            <input id="pass" type="password" className={styles.input} autoComplete='true' placeholder="Password" title="Password input" />
            <i className={styles.eyeHidePass} onClick={(e) => { showAndHidePass(e, '#pass') }}></i>
        </section>
    );
}

export default PasswordInput;