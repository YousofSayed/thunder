import { useEffect, useState } from 'react';
import textLogo from '../../Assets/images/textLogo.png';
import userAvatar from '../../Assets/images/user-avatar.png';
import tb from '../../js/tb';
import { parse } from "../../js/cocktail";


function Header() {
    const [profImg, setProfImg] = useState('');
    const [name, setName] = useState('');
    const [showSearchListComp, setShowSearchListComp] = useState(false);
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
    }


    return (
        <header className=" h-fit px-2 m-auto mt-[10px] " title='header'>

            <section className="relative m-auto container flex ltrD items-center p-2 bg-gray-900 justify-between rounded-lg" title='container'>

                <figure className="flex items-center gap-2">
                    <i className="fa-solid fa-bolt text-3xl text-cyan-400" title='thunder logo'></i>
                    <img src={textLogo} alt="thunder" className='w-[110px]' title='thunder text logo' loading='lazy'/>
                </figure>

                <figure className="flex items-center gap-2 px-2 rounded h-full" onClick={showLogOrSignComp}>
                    <p className="font-bold text-xl hidden sm:block" title='name of user'>{name}</p>
                    <img className="w-9 h-9 rounded-full cursor-pointer" src={profImg} id="profImgId" alt='' loading='lazy' title='profile image' />
                </figure>

                <marquee className="h-[2px] absolute  scale-0 bottom-0  overflow-hidden" id="marq" direction="right" scrollamount="50"><div className='h-[2px] w-[150px] bg-cyan-400'></div></marquee>
            </section>

        </header>

    );
}

export default Header;