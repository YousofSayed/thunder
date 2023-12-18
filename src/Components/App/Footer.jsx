import { useEffect } from "react";
import { $, $a } from "../../js/cocktail"
import { Link } from "react-router-dom";

function Footer() {

    useEffect(() => {
        const route = location.pathname.replace('/', '')
        if(!route)return;
        $a('#routes a').forEach(a => a.classList.remove('text-shadow', 'text-cyan-400'));
        $(`#routes #${route}`).classList.add('text-shadow', 'text-cyan-400')
    })

    const handleRoutes = (ev) => {
        $a('#routes a').forEach(a => {
            a.classList.remove('text-shadow', 'text-cyan-400')
            ev.currentTarget.classList.add('text-shadow', 'text-cyan-400')
        });
    };

    return (
        <footer className="w-full h-[45px] flex  justify-center px-2">
            <ul id="routes" className="container bg-gray-900 rounded-lg p-2 flex items-center justify-between">
                <Link id="profile" to={'/profile'} onClick={handleRoutes}><i className="fa-solid fa-user cursor-pointer"></i></Link>
                <Link id="settings" to={'/settings'} onClick={handleRoutes}><i className="fa-solid fa-gear cursor-pointer"></i></Link>
                <Link id="home" className="text-shadow text-cyan-400" to={'/'} onClick={handleRoutes}><i className="fa-solid fa-home cursor-pointer "></i></Link>
                <Link id="bookmarks" to={'/bookmarks'} onClick={handleRoutes}><i className="fa-solid fa-bookmark cursor-pointer"></i></Link>
                <Link id="search" to={'/search'} onClick={handleRoutes}><i className="fa-solid fa-search cursor-pointer"></i></Link>
            </ul>
        </footer>
    );
}

export default Footer;