import { useContext, useEffect, useRef, useState } from "react";
import { $, CocktailDB, addClickClass, copyToClipboard, isNumber, nFormatter, parse } from "../../js/cocktail";
import { getFromTo, update } from "../../js/global";
import { postSocket } from "../../js/initSockets";
import { PostContext } from "../Post";

function Reacts({ reacts, retweets, _id, index, userID }) {
    const [react, setReact] = useState('');
    const [retweet, setRetweet] = useState(false);
    const reactIconRef = useRef();
    const reacCounterRef = useRef();
    const retweetRef = useRef();
    const editeIconRef = useRef();
    const {context , setContext} = useContext(PostContext);
    const { showPostEditBtn } = context;
    const user = parse(localStorage.getItem('user'));
    const db = new CocktailDB(user.email);

    useEffect(() => {
        checkReact();
    }, [])

    //Methods
    const checkReact = async () => {
        const reactFromIDB = await (await db.openCollection('Reacts')).findOne({ _id });
        if (reactFromIDB) {
            reactIconRef.current.classList.add('text-red-700', 'fa-solid', 'text-2xl');
            setReact(reactFromIDB.type);
        }
    };

    // const checkRe

    const doReact = async (ev, nameOfReact) => {
        const btn = ev.currentTarget;
        addClickClass(btn, 'click')
        try {
            btn.disabled = true;


            if (!react) {
                reactIconRef.current.classList.add('text-red-700', 'fa-solid', 'text-2xl');
                isNumber(reacCounterRef.current.textContent) ? reacCounterRef.current.textContent++ : null;
                const post = await getFromTo('Posts', index, index);
                setReact(nameOfReact);
                if (post[0] && post[0].type == 'post') {
                    post[0].schema.reacts[nameOfReact]++;
                    const updateRespone = await update(`Posts!A${index}`, post[0]);
                    await ((await db.openCollection('Reacts')).set({ _id, type: nameOfReact }));
                    postSocket.emit('updateReact', { elementRoot: `#${nameOfReact}N-${_id}`, num: post[0].schema.reacts[nameOfReact] })
                }
            }
            else {
                reactIconRef.current.classList.remove('text-red-700', 'fa-solid', 'text-2xl');
                isNumber(reacCounterRef.current.textContent) && reacCounterRef.current.textContent > 0 ? reacCounterRef.current.textContent-- : null;
                const post = await getFromTo('Posts', index, index);
                setReact('');
                if (post[0]) {
                    +post[0].schema.reacts[nameOfReact] > 0 ? +post[0].schema.reacts[nameOfReact]-- : null;
                    const updateRespone = await update(`Posts!A${index}`, post[0]);
                    await ((await db.openCollection('Reacts')).deleteOne({ _id }))
                    postSocket.emit('updateReact', { elementRoot: `#${nameOfReact}N-${_id}`, num: post[0].schema.reacts[nameOfReact] })
                }
            }

            btn.disabled = false;
        } catch (error) {
            btn.disabled = false;
            throw new Error(error.message);
        }
    };

    const doRetweet = async (ev) => {
        const btn = ev.currentTarget;
        addClickClass(btn, 'click');
        btn.disabled = true;
        const post = await getFromTo('Posts', index, index);
        if (post[0]) {
            post[0] = parse(post[0]);
            post[0].schema.retweets++;
        }
    };

    const doEdit = (ev) => {
        const btn = ev.currentTarget;
        addClickClass(btn, 'click');
        editeIconRef.current.classList.toggle('text-cyan-400');
        showPostEditBtn ? setContext({...context , showPostEditBtn:false }) : setContext({...context , showPostEditBtn:true , editeIconRef:editeIconRef.current})
    }

    return (
        <ul className="mt-2  w-[100%] p-2 bg-gray-900 flex items-center justify-between ring-1 rounded-lg">
            <button onClick={(ev) => { doReact(ev, `love`); }} className="flex items-center gap-2">
                <i ref={reactIconRef} className={`fa-regular  fa-heart cursor-pointer text-xl md:hover:text-cyan-400 transition-all`}></i>
                <span ref={reacCounterRef} className="ml-1 text-cyan-400 font-semibold">
                    {nFormatter(reacts.love)}
                </span>
            </button>

            <button className="flex items-center gap-2" onClick={doRetweet}>
                <i id={`retweet-${_id}`} className="fa-solid fa-retweet cursor-pointer text-xl md:hover:text-cyan-400 transition-all"></i>{" "}
                <span className="ml-1">{nFormatter(retweets)}</span>
            </button>

            <button onClick={doEdit}>
                <i ref={editeIconRef} className="fa-solid fa-pen-to-square text-lg "></i>
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