import { useContext, useEffect, useState } from 'react';
import textLogo from '../../Assets/images/textLogo.png';
import logo from '../../Assets/images/logo.svg';
import userAvatar from '../../Assets/images/user-avatar.png';
import tb from '../../js/tb';
import { addClickClass, parse } from "../../js/cocktail";


function Header() {
    const [profImg, setProfImg] = useState('');
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
            getProfImgAndName();
            throw new Error(error.message)
        }

    };

    const showLogOrSignComp = () => {
        if (user) return;
        $('#logOrSign').classList.remove('hidden');
    };

    const handledDarkMode = (ev) => {
        addClickClass(ev.currentTarget, 'click');

        if (theme == 'dark') {
            setTheme('light');
            localStorage.setItem('theme', 'light');
            document.documentElement.classList.remove('dark');
        }
        else {
            setTheme('dark');
            localStorage.setItem('theme', 'dark');
            document.documentElement.classList.add('dark');
        }
    }


    return (
        <header className="w-full h-[60px] z-10 blur-c dark:border-b  dark:border-b-gray-400" title='header'>

            <section dir='ltr' className="relative h-[100%] m-auto container flex  items-center   justify-between rounded-lg" title='container'>

                <figure className="flex items-center gap-2">
                    {/* <i className="fa-solid fa-bolt text-3xl text-cyan-400" title='thunder logo'></i> */}
                    <img src={logo} alt="thunder" className='h-[40px] dark:invert-[100%]' title='thunder text logo' loading='lazy' />
                </figure>

                <section className='flex items-center gap-5'>
                    <figure className='cursor-pointer' onClick={handledDarkMode}>
                        <i className={`fa-solid ${theme == 'dark' ? 'fa-moon' : 'fa-sun'} text-2xl  text-black dark:text-white `} title={theme == 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}></i>
                    </figure>

                    <figure className={`flex items-center gap-2  rounded h-full ${user && 'px-2'} sm:bg-[#fff] sm:dark:bg-gray-950`} onClick={showLogOrSignComp}>
                        {user && <p className="font-bold text-xl hidden sm:block text-black dark:text-white" title='name of user'>{user.name}</p>}
                        <img className="w-[30px] h-[30px] rounded-full cursor-pointer ring-2" src={profImg} id="profImgId" alt='' loading='lazy' title='profile image' />
                    </figure>
                </section>

                <marquee className="h-[2px] absolute  scale-0 bottom-0  overflow-hidden" id="marq" direction="right" scrollamount="50"><div className='h-[2px] w-[150px] bg-cyan-400'></div></marquee>
            </section>

        </header>

    );
}

export default Header;