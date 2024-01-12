import { createContext, useEffect, useRef, useState } from "react";
import { uniqueID } from "../js/cocktail";
import tb from "../js/tb";
import Reacts from "./Post/Reacts";
import PostHeader from "./Post/Header";
import PostArticle from "./Post/Article";
import PostDate from "./Post/Date";
import PostMedia from "./Post/Media";
import { gsap } from 'gsap/all';

export const PostContext = createContext();
const tl = gsap.timeline({repeatDelay:0});

function Post({ post, className, withReacts, repost }) {
    const { postContent, index } = post
    const postRef = useRef();
    const [context, setContext] = useState({
        showPostEditBtn: false,
        editeValue: postContent,
        content: postContent,
        postRef: postRef.current,
        repost,
        post,
        ...post
    });
    const unId = uniqueID();

    useEffect(() => {
        setContext({ ...context, postRef: postRef.current })
    }, []);

    useEffect(() => {
        if (!postRef.current) return
        tl.fromTo(postRef.current, {
            scrollTrigger: {
                trigger: postRef.current,
                start:'center 80%',
            },
            x: -100,
            opacity: 0,
            duration: .5
        },{
            x: 0,
            opacity: 1,
            duration: .5
        },'<0.3');
    },[])


    return (
        <section id={`post-${unId}`} index={context.index} ref={postRef} className={`w-full translate-x-[-100] p-2 rounded-lg  bg-white dark:bg-[#000] ${className}`}>
            {/* <PostContext.Provider value={{ context, setContext }}> */}
            <PostHeader context={context} setContext={setContext} />

            <PostDate date={context.date} />

            <PostArticle context={context} setContext={setContext} />

            <PostMedia media={context.media} post={context.post} repost={context.repost} />

            {withReacts && <Reacts context={context} setContext={setContext} type={'post'} />}
            {/* </PostContext.Provider> */}
        </section>
    );
}

export default Post;