import { useEffect, useState } from 'react';
import textLogo from '../../Assets/images/textLogo.png';
import userAvatar from '../../Assets/images/user-avatar.png';
import tb from '../../js/tb';
import { parse } from "../../js/cocktail";


function Header() {
    const [profImg, setProfImg] = useState('');
    const [theme , setTheme] = useState(localStorage.getItem('theme'));
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

    const handledDarkMode = ()=>{
        if(theme == 'dark'){
            setTheme('light');
            localStorage.setItem('theme','light');
            document.documentElement.classList.remove('dark');
        }
        else{
            setTheme('dark');
            localStorage.setItem('theme','dark');
            document.documentElement.classList.add('dark');
        }
    }


    return (
        <header className=" h-fit px-2 m-auto mt-[10px] " title='header'>

            <section className="relative m-auto container flex ltrD items-center p-2 bg-[#eee] dark:bg-gray-900 justify-between rounded-lg" title='container'>

                <figure className="flex items-center gap-2">
                    {/* <i className="fa-solid fa-bolt text-3xl text-cyan-400" title='thunder logo'></i> */}
                    <img src={textLogo} alt="thunder" className='w-[110px]' title='thunder text logo' loading='lazy' />
                </figure>

                <section className='flex items-center gap-5'>
                    <figure className='cursor-pointer' onClick={handledDarkMode}>
                        <i className={`fa-solid ${theme == 'dark' ? 'fa-moon' : 'fa-sun'} text-2xl text-shadow text-cyan-400`} title={theme=='dark' ? 'Switch to light mode' : 'Switch to dark mode'}></i>
                        
                    </figure>

                    <figure className="flex items-center gap-2 px-2 rounded h-full sm:bg-[#fff] sm:dark:bg-gray-950" onClick={showLogOrSignComp}>
                        <p className="font-bold text-xl hidden sm:block text-black dark:text-white" title='name of user'>{user.name}</p>
                        <img className="w-9 h-9 rounded-full cursor-pointer ring-4" src={profImg} id="profImgId" alt='' loading='lazy' title='profile image' />
                    </figure>
                </section>

                <marquee className="h-[2px] absolute  scale-0 bottom-0  overflow-hidden" id="marq" direction="right" scrollamount="50"><div className='h-[2px] w-[150px] bg-cyan-400'></div></marquee>
            </section>

        </header>

    );
}

export default Header;