import { $, CocktailDB, addClickClass, hash, isValidDate, isValidEmail, isValidName, isValidPassword, stringify, uniqueID } from '../js/cocktail';
import userAvater from '../Assets/images/user-avatar.png'
import Logo from '../Components/Shared/Logo';
import styles from '../js/styles';
import { showMarquee, warn } from '../js/global';
import tb from '../js/tb';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import PasswordInput from '../Components/Shared/PasswordInput';

function Signup() {
    const navigate = useNavigate()
    const [profImgId, setProfImgId] = useState('');
    const profImgRef = useRef();
    const submitBtnRef = useRef();
    const signup = async (e) => {
        try {
            e.preventDefault();
            showMarquee(true);
            addClickClass(submitBtnRef.current, 'click');
            const validation = [
                isValidName($('#name').value),
                isValidEmail($('#email').value),
                isValidPassword($('#pass').value),
                isValidDate($('#date').value),
            ];

            for (const result of validation) {
                const { valid, msg } = result;
                if (!valid) { warn(msg); showMarquee(false); return }
            };
            warn('');

            const data = {
                name: $('#name').value,
                email: $('#email').value.toLowerCase().trim(),
                date: $('#date').value,
                id: hash($('#email').value.toLowerCase().trim() + $('#pass').value.trim()),
                profImgId: profImgId || ''
            };


            showMarquee(false);
            localStorage.setItem('user', stringify(data));
            const db = new CocktailDB(data.email);
            await db.createCollction('Bookmarks');
            await db.createCollction('Reports');
            await db.createCollction('Reacts');
            await db.createCollction('Reposts');
            await db.createCollction('Followers');
            await db.createCollction('Following');
            await db.createCollction('Posts');
            setTimeout(() => {
                navigate('/')
            })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const uploadProfImg = async (e) => {
        try {
            showMarquee(true);
            submitBtnRef.current.disabled = true;
            profImgRef.current.src = URL.createObjectURL(e.target.files[0])
            const res = await tb.sendFile(e.target.files[0]);
            setProfImgId(res.id)
        } catch (error) {
            throw new Error(error.message)
        }
        finally {
            submitBtnRef.current.disabled = false;
            showMarquee(false);
        }
    }

    return (
        <section className='w-full h-full'>
            <Logo />
            <section className='h-[calc(100%-56px)] grid items-center bg-white dark:bg-gray-950 '>
                <form className={styles.form} onSubmit={signup} >
                    <marquee className="w-full h-[2px] scale-0" id="marq" direction="right" scrollamount="50"><div className='h-[2px] w-[150px] bg-cyan-400'></div></marquee>
                    <h1 className={styles.title}>Signup</h1>
                    <img src={userAvater} ref={profImgRef} className="w-32 h-32 cursor-pointer rounded-full" onClick={(ev) => {addClickClass(ev.currentTarget); $('#inpFile').click() }} alt="user avatar" />
                    <div id="warn" className={styles.warn}></div>
                    <input type="text" id="name" placeholder="Enter Your Name" className={styles.input} />
                    <input type="email" id="email" placeholder="Enter Your Email" className={styles.input} />
                    <PasswordInput />
                    <input type="text" id="date" placeholder="YYYY/MM/DD" className={styles.input} />

                    <button type="submit" ref={submitBtnRef} className={styles.btn}>Signup</button>

                    <input type="file" onChange={uploadProfImg} id="inpFile" className="hidden" accept='.png,.jpg,.jpeg' />
                </form>
            </section>
        </section>
    );
}

export default Signup;

