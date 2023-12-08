import { useEffect, useState } from "react";
import { $, CocktailDB, isNumber, nFormatter, parse } from "../js/cocktail";
import { getFromTo, update } from "../js/global";
import { postSocket } from "../js/initSockets";

function Reacts({ reacts, retweets, _id, index , userID }) {
    const [react, setReact] = useState('');
    const [retweet , setRetweet] = useState(false)
    const user = parse(localStorage.getItem('user'));
    const db = new CocktailDB(user.email);


    const doReact = async (ev,nameOfReact) => {
        const btn = ev.currentTarget;
        try {
            const reactIcon = $(`#${nameOfReact}I-${_id}`);
            const reactNum = $(`#${nameOfReact}N-${_id}`);
            btn.disabled = true;
    
    
            if (!react) {
                reactIcon.classList.add('text-red-700', 'fa-solid', 'text-2xl');
                isNumber(reactNum.textContent) ? reactNum.textContent++ : null;
                const post = await getFromTo('Posts', index, index);
                console.log(post);
                setReact(nameOfReact);
                if (post[0] && post[0].type == 'post') {
                    post[0].schema.reacts[nameOfReact]++;
                    const updateRespone = await update(`Posts!A${index}`, post[0]);
                    postSocket.emit('updateReact', { elementRoot: `#${nameOfReact}N-${_id}`, num: post[0].schema.reacts[nameOfReact] })
                }
            }
            else {
                reactIcon.classList.remove('text-red-700', 'fa-solid', 'text-2xl');
                isNumber(reactNum.textContent) && reactNum.textContent > 0 ? reactNum.textContent-- : null;
                const post = await getFromTo('Posts', index, index);
                setReact('');
                if (post[0]) {
                    +post[0].schema.reacts[nameOfReact] > 0 ? +post[0].schema.reacts[nameOfReact]-- : null;
                    const updateRespone = await update(`Posts!A${index}`, post[0]);
                    console.log(updateRespone);
                    postSocket.emit('updateReact', { elementRoot: `#${nameOfReact}N-${_id}`, num: post[0].schema.reacts[nameOfReact] })
                }
            }
    
            btn.disabled = false;
        } catch (error) {
            btn.disabled = false;
            throw new Error(error.message);
        }
    }

    const doRetweet = async (ev) => {
        const btn = ev.currentTarget;
        btn.disabled = true;
        const post = await getFromTo('Posts', index, index);
        if(post[0]){
            post[0] = parse(post[0]);
            post[0].schema.retweets++;
        }
    }

    return (
        <ul className="mt-2  w-[100%] p-2 bg-gray-900 flex items-center justify-between ring-1 rounded-lg">
            <button onClick={(ev) => { doReact(ev,`love`); }} className="w-fit">
                <i id={`loveI-${_id}`} className={`fa-regular  fa-heart cursor-pointer text-xl hover:text-cyan-400 transition-all`}></i>
                <span id={`loveN-${_id}`} className="ml-1 text-cyan-400 font-semibold">
                    {nFormatter(reacts.love)}
                </span>
            </button>

            <button className="flex items-center gap-2" onClick={doRetweet}>
                <i id={`retweet-${_id}`} className="fa-solid fa-retweet cursor-pointer text-xl hover:text-cyan-400 transition-all"></i>{" "}
                <span className="ml-1">{nFormatter(retweets)}</span>
            </button>

            <button>
                <i className="fa-solid fa-pen-to-square text-lg "></i>
            </button>

            <button>
                <i className="fa-regular fa-flag text-lg "></i>
            </button>

            <button>
                <i className="fa-regular fa-bookmark text-lg "></i>
            </button>

            {   
                <button>
                    <i className="fa-solid fa-trash text-red-600 text-lg"></i>
                </button>
            }
        </ul>
    );
}

export default Reacts;