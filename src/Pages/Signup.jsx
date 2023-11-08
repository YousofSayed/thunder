import { $, hash, isValidDate, isValidEmail, isValidName, isValidPassword, isValidRePassword, stringify, uniqueID, wssEmit } from '../js/cocktail';
import userAvater from '../Assets/images/user-avatar.png'
import Logo from '../Components/Logo';
import styles from '../js/styles';
import { useNavigate } from 'react-router-dom';
import { filterData, setData, tb } from '../js/db';
import { success, warn } from '../js/global';

/**
 * Returns Signup component
 * @param {WebSocket} wss 
 * @returns {string}
 */

function Signup({ wss }) {
    const navigate = useNavigate()
    let profImgId;

    const signup = async (e) => {
        try {
            e.preventDefault();
            const validation = [
                isValidName($('#name').value),
                isValidEmail($('#email').value),
                isValidDate($('#date').value),
                isValidPassword($('#pass').value),
                isValidRePassword($('#pass').value, $('#rePass').value),
            ];

            for (const result of validation) {
                const { valid, msg } = result;
                if (!valid) {warn(msg) ; return }
            };
            warn('');

            const data = {
                _id: uniqueID(),
                name: $('#name').value,
                email: $('#email').value,
                password: hash($('#pass').value),
                date: $('#date').value,
                profImgId: profImgId || ''
            }

            //Check if User already in use
            const isUser = await filterData({
                dbName: 'Users',
                value: data.email,
                boolean:true
            })

            if(isUser.ok){ warn(`Email already in use.`); return}

            const res = await setData({
                dbName: `Users`,
                data
            });

            console.log(res);
            if (res._id) {
                delete data.password
                localStorage.setItem('user',stringify(data));
                success(`Successfully regstired`)
                setTimeout(() => { navigate('/') }, 1500);
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const uploadProfImg = async (e) => {
        try {
            const res = await tb.sendFile(e.target.files[0]);
            if (res.ok) {
                profImgId = res.id;
                $('#profImg').src = URL.createObjectURL(e.target.files[0])
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
        <>
            <Logo />
            <form className={styles.form} onSubmit={signup} >
                <h1 className={styles.title}>Signup</h1>
                <img src={userAvater} className="w-32 h-32 cursor-pointer rounded-full" id="profImg" onClick={() => { $('#inpFile').click() }} alt="user avatar" />
                <div id="warn" className={styles.warn}></div>
                <input type="text" id="name" placeholder="Enter your name" className={styles.input} />
                <input type="email" id="email" placeholder="Enter your email" className={styles.input} />
                <input type="date" id="date" placeholder="Enter your date" className={styles.input} />
                <div className="w-full relative"><input type="password" id="pass" placeholder="Enter your password" className={styles.input} /> <i className={styles.eyeHidePass} onClick={(e) => { showAndHidePass(e, '#pass') }}></i></div>
                <div className="w-full relative"><input type="password" id="rePass" placeholder="Re passowrd" className={styles.input} /> <i className={styles.eyeHidePass} onClick={(e) => { showAndHidePass(e, '#rePass') }}></i></div>

                <button type="submit" className={styles.btn}>Signup</button>

                <input type="file" onChange={uploadProfImg} id="inpFile" className="hidden" />
            </form>
        </>
    );
}

export default Signup;


