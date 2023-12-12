import { useContext, useEffect, useRef, useState } from "react";
import { $, CocktailDB, addClickClass, copyToClipboard, getLocalDate, isNumber, nFormatter, parse } from "../../js/cocktail";
import { clear, getFromTo, update } from "../../js/global";
import { postSocket } from "../../js/initSockets";
import { useNavigate } from "react-router-dom";

function PostReacts({ context, setContext }) {
    const [react, setReact] = useState('');
    const [isRepost, setIsRepost] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const navigete = useNavigate();
    const reactIconRef = useRef();
    const reacCounterRef = useRef();
    const editeIconRef = useRef();
    const { showPostEditBtn, postSectionRef, postRef,_id, userID, reacts, index, reposts, post, repost } = context;
    const user = parse(localStorage.getItem('user'));
    const db = new CocktailDB(user.email);
    useEffect(() => {
        checkReact();
        checkRepost();
        checkSavedPost();
    }, []);


    //Methods
    const checkReact = async () => {
        const reactFromIDB = await (await db.openCollection('Reacts')).findOne({ _id });
        reactFromIDB ? setReact(reactFromIDB.type) : setReact('');
    };

    const checkRepost = async () => {
        const repostIDB = await (await db.openCollection('Reposts')).findOne({ _id });
        repostIDB ? setIsRepost(repostIDB) : setIsRepost(false);
    };

    const checkSavedPost = async () => {
        const IDBRes = await (await db.openCollection('Bookmarks')).findOne({ _id: repost ? repost._id : post._id });
        IDBRes ? setIsSaved(true) : setIsSaved(false);
    }

    const doReact = async (ev, nameOfReact) => {
        const btn = ev.currentTarget;
        addClickClass(btn, 'click');

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
                    await (await db.openCollection('Reacts')).set({ _id, type: nameOfReact })
                    postSocket.emit('updateReact', { elementRoot: `#${nameOfReact}N-${_id}`, num: post[0].schema.reacts[nameOfReact] })
                }
            }
            else {
                reactIconRef.current.classList.remove('text-red-700', 'fa-solid', 'text-2xl');
                isNumber(reacCounterRef.current.textContent) && reacCounterRef.current.textContent > 0 ? reacCounterRef.current.textContent-- : null;
                const post = await getFromTo('Posts', index, index);
                setReact('');
                if (post[0] && post[0].type == 'post') {
                    +post[0].schema.reacts[nameOfReact] > 0 ? +post[0].schema.reacts[nameOfReact]-- : null;
                    const updateRespone = await update(`Posts!A${index}`, post[0]);
                    await ((await db.openCollection('Reacts')).deleteOne({ _id }))
                    postSocket.emit('updateReact', { elementRoot: `#${nameOfReact}N-${_id}`, num: post[0].schema.reacts[nameOfReact] })
                }
            }

        } catch (error) {
            throw new Error(error.message);
        }
        finally {
            btn.disabled = false;
        }
    };

    const doRepost = async (ev) => {
        if (isRepost) {
            const currentDate = getLocalDate();
            const repostDate = new Date(isRepost.date).toLocaleDateString('en-US');
            if (currentDate == repostDate) {
                alert('You Reposted this post today you should to wait for tomorrow!');
                return
            }
        }
        sessionStorage.setItem('postSectionScroll', postSectionRef.scrollTop)
        navigete(`/repost/${index}`);
    };

    const doEdit = (ev) => {
        const btn = ev.currentTarget;
        addClickClass(btn, 'click');
        editeIconRef.current.classList.toggle('text-cyan-400');
        showPostEditBtn ? setContext({ ...context, showPostEditBtn: false }) : setContext({ ...context, showPostEditBtn: true, editeIconRef: editeIconRef.current })
    };

    // const doReport = async (ev) => {
    //     const btn = ev.current.target;

    // };

    const doSave = async (ev) => {
        const btn = ev.currentTarget;
        addClickClass(btn, 'click')
        btn.disabled = true;
        try {
            if (!isSaved) {
                const IDBRes = await (await db.openCollection('Bookmarks')).set(repost ? repost : post);
                setIsSaved(true);
            }
            else {
                const IDBRes = await (await db.openCollection('Bookmarks')).deleteOne({ _id: repost ? repost._id : post._id });
                setIsSaved(false);
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            btn.disabled = false;
        }
    };

    const doDelete = async (ev) => {
        const btn = ev.currentTarget;
        addClickClass(btn, 'click')
        try {
            btn.disabled = true;
            const res = await clear(`Posts!A${repost ? repost.index : index}`);
            postRef.remove();
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            btn.disabled = false;
        }
    }


    return (
        <ul className={`mt-2  w-[100%] p-2 bg-gray-900 flex items-center justify-between ring-1 rounded-lg ${repost ? 'bg-gray-950' : 'bg-gray-900'}`}>
            <button onClick={(ev) => { doReact(ev, `love`); }} className="flex items-center gap-2">
                <i ref={reactIconRef} className={`fa-regular fa-heart cursor-pointer text-xl ${react ? `fa-solid text-red-600 text-2xl` : null} md:hover:text-cyan-400 transition-all`}></i>
                <span ref={reacCounterRef} className="ml-1 text-cyan-400 font-semibold">
                    {nFormatter(reacts.love)}
                </span>
            </button>

            <button className="flex items-center gap-2" onClick={doRepost}>
                <i className={`fa-solid fa-retweet cursor-pointer text-xl md:hover:text-cyan-400 ${isRepost ? `fa-solid text-cyan-400 text-2xl` : null} transition-all`}></i>{" "}
                <span className="ml-1">{nFormatter(reposts)}</span>
            </button>

            {
                (repost?._id || user.id != userID)
                &&
                <button onClick={(ev) => { doEdit(ev) }}>
                    <i ref={editeIconRef} className="fa-solid fa-pen-to-square text-lg "></i>
                </button>
            }

            {/* {
                !+reposts
                &&
                < button onClick={doReport}>
                    <i className="fa-regular fa-flag text-lg "></i>
                </button>
            } */}

            <button onClick={doSave}>
                <i className={`fa-regular fa-bookmark text-lg ${isSaved && `fa-solid text-cyan-400`}`}></i>
            </button>

            {
                user.id == userID
                &&
                <button onClick={doDelete}>
                    <i className="fa-solid fa-trash text-red-600 text-lg"></i>
                </button>
            }
        </ul >
    );
}

export default PostReacts;