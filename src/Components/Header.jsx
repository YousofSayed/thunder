import { useEffect, useState } from 'react';
import textLogo from '../Assets/images/textLogo.png'
import userAvatar from '../Assets/images/user-avatar.png'
import tb from '../js/tb';
import { parse } from "../js/cocktail";


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
            throw new Error(error.message)
        }

    };


    const showLogOrSignComp = () => {
        if (user) return;
        $('#logOrSign').classList.remove('hidden');
    }


    return (
        <header className=" h-fit px-2 m-auto mt-[10px] " title='header'>

            <section className=" m-auto container flex items-center p-2 bg-gray-900 justify-between rounded-lg" title='container'>

                <figure className="flex items-center gap-2">
                    <i className="fa-solid fa-bolt text-3xl text-cyan-400" title='thunder logo'></i>
                    <img src={textLogo} alt="thunder" title='thunder text logo' />
                </figure>

                {/* <article className="items-center w-3/5 gap-2 bg-gray-950 p-2 rounded-lg hidden md:flex">
                    <input type="search" className=" w-full bg-transparent font-bold outline-none" placeholder="Search" title="search input" onKeyUp={handleSearch} />
                    <i className="fa-solid  fa-search text-1xl text-white" title='search icon'></i>
                </article> */}

                <figure className="flex items-center gap-2 px-2 rounded h-full" onClick={showLogOrSignComp}>
                    <p className="font-bold text-xl hidden sm:block" title='name of user'>{name}</p>
                    <img className="w-9 h-9 rounded-full cursor-pointer" src={profImg} id="profImgId" alt='' loading='lazy' title='profile image' />
                </figure>

            </section>

        </header>

    );
}

export default Header;