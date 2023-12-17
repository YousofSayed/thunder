import { useState } from "react";
import { getAllSheetValues } from "../../js/global";

function Search({postViewStates}) {
    const [states , setStates] = postViewStates;
    const [inpVal , setInpVal] = useState(''); 

    const handleSreach = async(ev)=>{
        setInpVal(ev.target.value)
        if(ev.key == 'Enter' || ev.key == 'enter'){
            let start = 0 , end = 5;
            const res = await(await getAllSheetValues(`Posts`)).filter(inpVal);
            console.log(res);
        }
    }

    return (
        <header className="w-full items-center bg-[#fff] dark:bg-gray-950 p-2 rounded-lg flex ring-1">
            <input type="search" onKeyUp={handleSreach} className=" w-full bg-transparent  text-black dark:text-white font-bold outline-none" placeholder="Search" title="search input" onInput={(ev) => { console.log(ev) }} />
            <i className="fa-solid  fa-search text-1xl text-cyan-400 dark:text-white" title='search icon'></i>
        </header>
    );
}

export default Search;