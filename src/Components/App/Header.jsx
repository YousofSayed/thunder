import { useContext, useEffect, useState } from 'react';
import textLogo from '../../Assets/images/textLogo.png';
import logo from '../../Assets/images/logo.svg';
import userAvatar from '../../Assets/images/user-avatar.png';
import tb from '../../js/tb';
import { addClickClass, parse } from "../../js/cocktail";
import { Marquee } from '../Shared/Marquee';


function Header() {
    const [profImg, setProfImg] = useState(userAvatar);
    const [theme, setTheme] = useState(localStorage.getItem('theme'));
    const user = parse(localStorage.getItem('user'));

    useEffect(() => {
        getProfImgAndName();
    }, []);

    //Methods
    const getProfImgAndName = async () => {
        try {
            if (!user || !user.profImgId) { setProfImg(userAvatar); return }
            setProfImg(await tb.getFileFromBot(user.profImgId))
        } catch (error) {
            setTimeout(()=>getProfImgAndName() , 2000);
            throw new Error(error.message)
        }

    };

    const showLogOrSignComp = () => {
        if (user) return;
        $('#logOrSign').classList.remove('hidden');
    };

    const handledDarkMode = (ev) => {
        addClickClass(ev.currentTarget, 'click');
        const html = document.documentElement
        html.classList.contains('dark') ? html.classList.replace('dark', 'light') : html.classList.replace('light', 'dark');
        if (theme == 'dark') {
            setTheme('light');
            localStorage.setItem('theme', 'light');
        }
        else {
            setTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    }


    return (
        <header className="w-full h-[60px]  z-10 blur-c dark:border-b  dark:border-b-gray-700  relative transition-all" title='header'>

            <section dir='ltr' className="relative w-full h-[100%] m-auto container flex  items-center  justify-between rounded-lg" title='container'>

                <figure className="flex items-center gap-2">
                    {/* <i className="fa-solid fa-bolt text-3xl text-cyan-400" title='thunder logo'></i> */}
                    <img src={logo} alt="thunder" className='max-h-[40px] max-w-[40px] dark:invert-[100%]' title='thunder text logo' loading='lazy' />
                    <p className='font-bold text-2xl text-black dark:text-white'>THUNDER</p>
                </figure>

                <section className='flex items-center gap-5'>
                    <figure className='cursor-pointer' onClick={handledDarkMode}>
                        <i className={`fa-solid ${theme == 'dark' ? 'fa-moon' : 'fa-sun'} text-2xl  text-black dark:text-white `} title={theme == 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}></i>
                    </figure>

                    <figure className={`flex items-center gap-2 p-2  h-full  `} onClick={showLogOrSignComp}>
                        {user && <p className="font-bold text-xl hidden sm:block text-black dark:text-white" title='name of user'>{user.name}</p>}
                        <img className="max-w-[40px] max-h-[35px] rounded-full cursor-pointer ring-black dark:ring-white ring-2" src={profImg} id="profImgId" alt='' loading='lazy' title='profile image' />
                    </figure>
                </section>
            </section>

        </header>

    );
}

export default Header;