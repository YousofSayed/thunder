import { createContext, useEffect, useRef, useState } from "react";
import {  uniqueID } from "../js/cocktail";
import tb from "../js/tb";
import Reacts from "./Post/Reacts";
import PostHeader from "./Post/Header";
import PostArticle from "./Post/Article";
import PostDate from "./Post/Date";
import PostMedia from "./Post/Media";
export const PostContext = createContext();

function Post({ post, className, withReacts, postSectionRef, repost }) {
    const { postContent, index } = post
    const postRef = useRef();
    const [context, setContext] = useState({
        showPostEditBtn: false,
        editeValue: postContent,
        content: postContent,
        postSectionRef,
        postRef:postRef.current,
        repost,
        post,
        ...post
    });
    const unId = uniqueID();

    useEffect(()=>{
        setContext({...context , postRef:postRef.current})
    },[])


    return (
        <section id={`post-${unId}`} index={context.index} ref={postRef} className={`w-full p-2  ${repost ? '' :  'bg-white dark:bg-[#080808]'} rounded-lg   ${className}`}>
            {/* <PostContext.Provider value={{ context, setContext }}> */}
                <PostHeader context={context} setContext={setContext} />

                <PostDate date={context.date}/>

                <PostArticle context={context} setContext={setContext} />

                <PostMedia media={context.media} post={context.post} repost={context.repost} />

                {withReacts && <Reacts context={context} setContext={setContext} type={'post'} />}
            {/* </PostContext.Provider> */}
        </section>
    );
}

export default Post;