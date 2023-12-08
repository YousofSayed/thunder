import { useEffect, useState } from 'react';
import userAvatar from'../Assets/images/user-avatar.png';
import { parse } from '../../js/cocktail';
import { tb } from '../js/db';
import { Link } from 'react-router-dom';

function Nav() {
    const [profImg , setProfImg] = useState('');
    const user = parse(localStorage.getItem('user'));

    useEffect(()=>{
        getProfImg();
    },[])

    //Methods
    const getProfImg = async()=>{
        if(!user || !user.profImgId){setProfImg(userAvatar) ;return};
        setProfImg(await tb.getFileFromBot(user.profImgId))
    }

    return ( 
        <nav className=" bg-gray-900 hidden md:block md:w-[calc(24%)] h-full rounded-lg p-2">
            <figure className='w-full flex gap-3 bg-gray-950 rounded-lg p-2 items-center'>
                <img src={profImg} alt="profImg" className='w-14 h-14 rounded-full cursor-pointer' />
                <p className='font-bold text-xl capitalize'>{user?.name? user.name : 'Whoami'}</p>
            </figure>

            <ul className='list-none py-3 flex flex-col gap-4'>
                <Link to={'posts'} className='font-bold text-lg w-full transition-all p-2 shadow-md  bg-gray-800 rounded hover:border-l-cyan-400 hover:bg-gray-950 ring-2 '><i className="fa-regular fa-newspaper mr-2 text-lg text-cyan-400"></i> <span>Posts</span></Link>
                <Link to={'friends'} className='font-bold text-lg w-full transition-all p-2 shadow-md bg-gray-800 rounded hover:border-l-cyan-400 hover:bg-gray-950'><i className="fa-solid fa-user-group mr-2 text-lg text-cyan-400 "></i> <span>Friends</span></Link>
                <Link to={'chats'} className='font-bold text-lg w-full transition-all p-2 shadow-md bg-gray-800 rounded hover:border-l-cyan-400 hover:bg-gray-950'><i className="fa-solid fa-message mr-2 text-lg text-cyan-400"></i> <span>Messages</span></Link>
                <Link to={'notfications'} className='font-bold text-lg w-full transition-all p-2  shadow-md bg-gray-800 rounded hover:border-l-cyan-400 hover:bg-gray-950'><i className="fa-solid fa-bell mr-2 text-lg text-cyan-400"></i> <span>Notfications</span></Link>
            </ul>
        </nav>
     );
}

export default Nav;