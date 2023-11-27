import { $, hash, isValidDate, isValidEmail, isValidName, isValidPassword, isValidRePassword, post, stringify} from '../js/cocktail';
import userAvater from '../Assets/images/user-avatar.png'
import Logo from '../Components/Logo';
import styles from '../js/styles';
import { useNavigate } from 'react-router-dom';
import { env, showMarquee, success, warn } from '../js/global';
import tb from '../js/tb';

/**
 * Returns Signup component
 * @param {WebSocket} wss 
 * @returns {string}
 */

function Signup() {
    const navigate = useNavigate()
    let profImgId;

    const signup = async (e) => {
        try {
            e.preventDefault();
            showMarquee(true);
            const validation = [
                isValidName($('#name').value),
                isValidEmail($('#email').value),
                isValidDate($('#date').value),
                isValidPassword($('#pass').value),
                isValidRePassword($('#pass').value, $('#rePass').value),
            ];

            for (const result of validation) {
                const { valid, msg } = result;
                if (!valid) { warn(msg); showMarquee(false); return }
            };
            warn('');

            const data = {
                name: $('#name').value,
                email: $('#email').value.toLowerCase(),
                password: hash($('#pass').value),
                date: $('#date').value,
                profImgId: profImgId || ''
            }

            //Check if User already in use
            // const isUser = await filterData({
            //     dbName: 'Users',
            //     value: data.email,
            //     boolean:true
            // })

            // if(isUser.ok){ warn(`Email already in use.`); return}

            // const res = await setData({
            //     dbName: `Users`,
            //     data
            // });
            const res = await post({
                url:`${env('VITE_SERVER_SIDE')}/signup`,
                data,
                json:true
            })

            showMarquee(false);
            if (res.ok) {
                localStorage.setItem('user', stringify(res.user));
                success(res.msg)
                setTimeout(() => { navigate('/') }, 1500);
            } else {
                warn(res.msg);
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
        <section className='w-full h-full'>
            <Logo />
            <section className='h-[calc(100%-56px)] grid items-center'>
                <form className={styles.form} onSubmit={signup} >
                    <marquee className="w-full h-[2px] scale-0" id="marq" direction="right" scrollamount="50"><div className='h-[2px] w-[150px] bg-cyan-400'></div></marquee>
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
            </section>
        </section>
    );
}

export default Signup;


