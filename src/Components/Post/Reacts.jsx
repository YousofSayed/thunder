import { useContext, useEffect, useRef, useState } from "react";
import { $, CocktailDB, addClickClass, copyToClipboard, getLocalDate, isNumber, nFormatter, parse, stringify } from "../../js/cocktail";
import { clear, getAllSheetValues, getFromTo, update } from "../../js/global";
import { postSocket } from "../../js/initSockets";
import { useNavigate } from "react-router-dom";
import { storeCtx } from "../../js/store";

function PostReacts({ context, setContext }) {
    const [react, setReact] = useState('');
    const [isRepost, setIsRepost] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const navigete = useNavigate();
    const reactIconRef = useRef();
    const reacCounterRef = useRef();
    const editeIconRef = useRef();
    const {state} = useContext(storeCtx);
    const { showPostEditBtn, postRef, userID, reacts, reposts, _id ,index, post, repost } = context;
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
                isNumber(reacCounterRef.current.textContent) ? reacCounterRef.current.textContent++ : null;
                setReact(nameOfReact);
                const postOrRepost = await getFromTo('Posts', index, index);
                if (postOrRepost[0] && postOrRepost[0].type == 'post') {
                    postOrRepost[0].schema.reacts[nameOfReact]++;
                }
                else if (postOrRepost[0] && postOrRepost[0].type == 'repost') {
                    postOrRepost[0].schema.post.reacts[nameOfReact]++;
                }
                const updateRespone = await update(`Posts!A${index}`, postOrRepost[0]);
                await (await db.openCollection('Reacts')).set({ _id, type: nameOfReact })
                // postSocket.emit('updateReact', { elementRoot: `#${nameOfReact}N-${_id}`, num: postOrRepost[0].schema.reacts[nameOfReact] })
            }
            else {
                isNumber(reacCounterRef.current.textContent) && reacCounterRef.current.textContent > 0 ? reacCounterRef.current.textContent-- : null;
                setReact('');
                const postOrRepost = await getFromTo('Posts', index, index);
                if (postOrRepost[0] && postOrRepost[0].type == 'post') {
                    +postOrRepost[0].schema.reacts[nameOfReact] > 0 ? +postOrRepost[0].schema.reacts[nameOfReact]-- : null;
                }
                else if (postOrRepost[0] && postOrRepost[0].type == 'repost') {
                    postOrRepost[0].schema.post.reacts[nameOfReact] > 0 ? postOrRepost[0].schema.post.reacts[nameOfReact]-- : null;
                }
                const updateRespone = await update(`Posts!A${index}`, postOrRepost[0]);
                await ((await db.openCollection('Reacts')).deleteOne({ _id }))
                // postSocket.emit('updateReact', { elementRoot: `#${nameOfReact}N-${_id}`, num: postOrRepost[0].schema.reacts[nameOfReact] })
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
        sessionStorage.setItem('postSectionScroll', state.postSectionRef.scrollTop)
        navigete(`/repost/${post.index}`);
    };

    const doEdit = async(ev) => {
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
                const IDBRes = await (await db.openCollection('Bookmarks')).set({ type: 'post', _id, schema: post });
                setIsSaved(true);
            }
            else {
                const IDBRes = await (await db.openCollection('Bookmarks')).deleteOne({ _id });
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
            const res = await clear(`Posts!A${index}`);
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
        <ul className={`mt-2  w-[100%] p-2 flex items-center justify-between  rounded-lg ${repost ? 'bg-white dark:bg-gray-950' : 'bg-[#eee] dark:bg-[#000]'}`}>
            <button onClick={(ev) => { doReact(ev, `love`); }} className="flex items-center gap-2">
                <i ref={reactIconRef} className={`fa-regular fa-heart cursor-pointer text-xl   ${react ? `fa-solid text-red-600 text-2xl` : `text-black dark:text-white`} md:hover:text-cyan-400 transition-all`}></i>
                <span ref={reacCounterRef} className="ml-1 text-cyan-400 font-semibold">
                    {nFormatter(reacts.love)}
                </span>
            </button>

            <button className="flex items-center gap-2" onClick={doRepost}>
                <i className={`fa-solid fa-retweet cursor-pointer text-xl  md:hover:text-cyan-400 ${isRepost ? `fa-solid text-cyan-400 text-2xl` : 'text-black dark:text-white'} transition-all`}></i>{" "}
                <span className="ml-1  text-cyan-400 font-semibold">{nFormatter(reposts)}</span>
            </button>

            {
                (user.id == userID)
                &&
                <button onClick={(ev) => { doEdit(ev) }}>
                    <i ref={editeIconRef} className={`fa-solid fa-pen-to-square text-lg text-black dark:text-white`}></i>
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
                <i className={`fa-regular fa-bookmark text-lg text-black dark:text-white ${isSaved && `fa-solid text-cyan-400`}`}></i>
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