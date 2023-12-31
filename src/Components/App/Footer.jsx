import { useEffect } from "react";
import { $, $a } from "../../js/cocktail"
import { Link } from "react-router-dom";

function Footer() {
    useEffect(() => {
        handleRoutesOnWindowChange()
    });

    const handleRoutes = (ev) => {
        $a('#routes a').forEach(a => {
            a.classList.remove('text-shadow', 'text-[12px]', 'ring-2', 'dark:bg-gray-950', 'bg-[#fff]')
            ev.currentTarget.classList.add('text-shadow', 'text-[12px]', 'ring-2', 'dark:bg-gray-950', 'bg-[#fff]')
        });
    };

    const handleRoutesOnWindowChange = () => {
        const route = location.pathname.replaceAll('/', '');
        if (!route) {
            $a('#routes a')?.forEach(a => a.classList.remove('text-shadow', 'text-[12px]', 'ring-2', 'dark:bg-gray-950', 'bg-[#fff]'));
            $(`#routes #home`)?.classList.add('text-[12px]', 'ring-2', 'dark:bg-gray-950', 'bg-[#fff]');
            return;
        };
        $a('#routes a')?.forEach(a => a.classList.remove('text-shadow', 'text-[12px]', 'ring-2', 'dark:bg-gray-950', 'bg-[#fff]'));
        $(`#routes #${route}`)?.classList.add('text-shadow', 'text-[12px]', 'ring-2', 'dark:bg-gray-950', 'bg-[#fff]')
    };

    return (
        <footer className="w-full h-[55px]  flex blur-c dark:border-t dark:border-t-gray-700  justify-center px-2 relative bac">
            <ul id="routes" className="container  rounded-lg p-2 flex items-center justify-between">
                <Link id="profile" className="dark:text-white text-black  w-[25px] h-[25px] flex items-center justify-center  rounded-full" to={'/profile'} onClick={handleRoutes}><i className="fa-solid fa-user cursor-pointer"></i></Link>
                <Link id="bookmarks" className="dark:text-white text-black w-[25px] h-[25px] flex items-center justify-center  rounded-full" to={'/bookmarks'} onClick={handleRoutes}><i className="fa-solid fa-bookmark cursor-pointer"></i></Link>
                <Link id="home" className="dark:text-white text-black w-[25px] h-[25px] flex items-center justify-center  rounded-full" to={'/'} onClick={handleRoutes}><i className="fa-solid  fa-home cursor-pointer "></i></Link>
                <Link id="settings" className="dark:text-white text-black w-[25px] h-[25px] flex items-center justify-center  rounded-full" to={'/settings'} onClick={handleRoutes}><i className="fa-solid fa-gear cursor-pointer"></i></Link>
                <Link id="search" className="dark:text-white text-black w-[25px] h-[25px] flex items-center justify-center  rounded-full" to={'/search'} onClick={handleRoutes}><i className="fa-solid fa-search cursor-pointer"></i></Link>
            </ul>
        </footer>
    );
}

export default Footer;