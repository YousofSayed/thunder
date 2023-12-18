import { useEffect, useRef, useState } from "react";
import { getAllSheetValues } from "../../js/global";

function SearchBar({ searchCompCtx }) {
    const [searchCtx, setSearchCtx] = searchCompCtx;
    const [inpVal, setInpVal] = useState('');
    const searchInpRef = useRef();

    useEffect(()=>{
        searchInpRef.current.focus();        
    },[])

    const handleSreach = async (ev) => {
        setInpVal(ev.target.value)
        if (ev.key == 'Enter' || ev.key == 'enter') {
            let start = 0, end = 5;
            setSearchCtx({ posts: [], showLoader: true, isNoDataHere: false });
            const res = await (await getAllSheetValues(`Posts`)).filter(inpVal);
            if (res) {
                setSearchCtx({ posts: res, showLoader: false, isNoDataHere: false });
            }
            else {
                setSearchCtx({ posts: [], isNoDataHere: true, showLoader: false });
            }
        }
    }

    return (
        <header className="w-full items-center bg-[#fff] dark:bg-gray-950 p-2 rounded-lg flex ring-1">
            <input ref={searchInpRef} type="search" onKeyUp={handleSreach} className=" w-full bg-transparent  text-black dark:text-white font-bold outline-none" placeholder="Search" title="search input" />
            <i className="fa-solid  fa-search text-1xl text-cyan-400 dark:text-white" title='search icon'></i>
        </header>
    );
}

export default SearchBar;