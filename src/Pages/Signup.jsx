import { $, CocktailDB, isValidDate, isValidEmail, isValidName, stringify, uniqueID } from '../js/cocktail';
import userAvater from '../Assets/images/user-avatar.png'
import Logo from '../Components/Logo';
import styles from '../js/styles';
import { useNavigate } from 'react-router-dom';
import { showMarquee, warn } from '../js/global';
import tb from '../js/tb';

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
            ];

            for (const result of validation) {
                const { valid, msg } = result;
                if (!valid) { warn(msg); showMarquee(false); return }
            };
            warn('');

            const data = {
                name: $('#name').value,
                email: $('#email').value.toLowerCase(),
                date: $('#date').value,
                id: uniqueID(),
                profImgId: profImgId || ''
            }


            showMarquee(false);
            localStorage.setItem('user', stringify(data));
            const db = new CocktailDB(data.email);
            await db.createCollction('Bookmarks');
            await db.createCollction('Reports');
            await db.createCollction('Retweets');
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
            const res = await tb.sendFile(e.target.files[0]);
            if (res.ok) {
                profImgId = res.id;
                $('#profImg').src = URL.createObjectURL(e.target.files[0])
            }
        } catch (error) {
            throw new Error(error.message)
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
                    <input type="text" id="name" placeholder="Enter Your Name" className={styles.input} />
                    <input type="email" id="email" placeholder="Enter Your Email" className={styles.input} />
                    <input type="text" id="date" placeholder="YYYY/MM/DD" className={styles.input} />

                    <button type="submit" className={styles.btn}>Signup</button>

                    <input type="file" onChange={uploadProfImg} id="inpFile" className="hidden" />
                </form>
            </section>
        </section>
    );
}

export default Signup;

