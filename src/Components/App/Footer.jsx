import { useEffect } from "react";
import { $, $a } from "../../js/cocktail"
import { Link } from "react-router-dom";

function Footer() {
    useEffect(() => {
        handleRoutesOnWindowChange()
    });

    const handleRoutes = (ev) => {
        $a('#routes a').forEach(a => {
            a.classList.remove('ring-2')
            ev.currentTarget.classList.add('ring-2')
        });
    };

    const handleRoutesOnWindowChange = () => {
        const route = location.pathname.replaceAll('/', '');
        if (!route) {
            $a('#routes a')?.forEach(a => a.classList.remove('ring-2'));
            $(`#routes #home`)?.classList.add('ring-2');
            return;
        };
        $a('#routes a')?.forEach(a => a.classList.remove('ring-2'));
        $(`#routes #${route}`)?.classList.add('ring-2')
    };

    return (
        <footer className="w-full h-[55px]  flex blur-c dark:border-t dark:border-t-gray-700  justify-center px-2 relative">
            <ul id="routes" className="container  rounded-lg p-2 flex items-center justify-between">
                <Link id="profile" className="dark:text-white  text-black ring-black dark:ring-white  w-[30px] h-[30px] flex items-center justify-center  rounded-full" to={'/profile'} onClick={handleRoutes}><i className="fa-solid fa-user cursor-pointer"></i></Link>
                <Link id="bookmarks" className="dark:text-white text-black ring-black dark:ring-white w-[30px] h-[30px] flex items-center justify-center  rounded-full" to={'/bookmarks'} onClick={handleRoutes}><i className="fa-solid fa-bookmark cursor-pointer"></i></Link>
                <Link id="home" className="dark:text-white text-black ring-black dark:ring-white w-[30px] h-[30px] flex items-center justify-center  rounded-full" to={'/'} onClick={handleRoutes}><i className="fa-solid  fa-home cursor-pointer "></i></Link>
                <Link id="settings" className="dark:text-white text-black ring-black dark:ring-white w-[30px] h-[30px] flex items-center justify-center  rounded-full" to={'/settings'} onClick={handleRoutes}><i className="fa-solid fa-gear cursor-pointer"></i></Link>
                <Link id="search" className="dark:text-white text-black ring-black dark:ring-white w-[30px] h-[30px] flex items-center justify-center  rounded-full" to={'/search'} onClick={handleRoutes}><i className="fa-solid fa-search cursor-pointer"></i></Link>
            </ul>
        </footer>
    );
}

export default Footer;