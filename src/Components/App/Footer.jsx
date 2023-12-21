import { useEffect } from "react";
import { $, $a } from "../../js/cocktail"
import { Link } from "react-router-dom";

function Footer() {

    useEffect(() => {
        const route = location.pathname.replaceAll('/', '')
        if (!route) {
            // $(`#routes #home`).classList.remove('text-shadow','text-black','dark:text-white');
            $(`#routes #home`)?.classList.add('text-[12px]', 'ring-2' ,'dark:bg-gray-950','bg-[#fff]')
            return;
        };
        $a('#routes a')?.forEach(a => a.classList.remove('text-shadow','text-[12px]', 'ring-2' ,'dark:bg-gray-950','bg-[#fff]'));
        $(`#routes #${route}`)?.classList.add('text-shadow','text-[12px]', 'ring-2' ,'dark:bg-gray-950','bg-[#fff]')
    })

    const handleRoutes = (ev) => {
        $a('#routes a').forEach(a => {
            a.classList.remove('text-shadow','text-[12px]', 'ring-2' ,'dark:bg-gray-950','bg-[#fff]')
            ev.currentTarget.classList.add('text-shadow','text-[12px]', 'ring-2' ,'dark:bg-gray-950','bg-[#fff]')
        });
    };

    return (
        <footer className="w-full h-[45px] flex mb-2 justify-center px-2">
            <ul id="routes" className="container bg-[#eee] dark:bg-gray-900 rounded-lg p-2 flex items-center justify-between">
                <Link id="profile" className="text-cyan-400 w-[25px] h-[25px] flex items-center justify-center  rounded-full" to={'/profile'} onClick={handleRoutes}><i className="fa-solid fa-user cursor-pointer"></i></Link>
                <Link id="bookmarks" className="text-cyan-400 w-[25px] h-[25px] flex items-center justify-center  rounded-full" to={'/bookmarks'} onClick={handleRoutes}><i className="fa-solid fa-bookmark cursor-pointer"></i></Link>
                <Link id="home" className="text-cyan-400 w-[25px] h-[25px] flex items-center justify-center  rounded-full" to={'/'} onClick={handleRoutes}><i className="fa-solid  fa-home cursor-pointer "></i></Link>
                <Link id="settings" className="text-cyan-400 w-[25px] h-[25px] flex items-center justify-center  rounded-full" to={'/settings'} onClick={handleRoutes}><i className="fa-solid fa-gear cursor-pointer"></i></Link>
                <Link id="search" className="text-cyan-400 w-[25px] h-[25px] flex items-center justify-center  rounded-full" to={'/search'} onClick={handleRoutes}><i className="fa-solid fa-search cursor-pointer"></i></Link>
            </ul>
        </footer>
    );
}

export default Footer;