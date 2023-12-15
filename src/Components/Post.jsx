import { createContext, useEffect, useRef, useState } from "react";
import { $a, $, parse, getLocalDate, stringify, uniqueID } from "../js/cocktail";
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

    useEffect(() => {
        // getImagesAndVideos();
        // observer.observe(postRef.current)
        // observer.observe(postRef.current)
    });

    useEffect(()=>{
        setContext({...context , postRef:postRef.current})
    },[])

    const getImagesAndVideos = () => {
        // $a(`#post-${unId}  img`).forEach(async (img) => {
        //     // if (!img.id || img.src) return;
        //     img.src = await tb.getFileFromBot(img.getAttribute('tbid'))
        // })
        // $a(`#post-${unId} video`).forEach(async (vid) => {
        //     // if (!vid.id || vid.src) return;
        //     vid.src = await tb.getFileFromBot(vid.getAttribute('tbid'))
        // })
    }


    return (
        <section id={`post-${unId}`} index={context.index} ref={postRef} className={`w-full p-2  ${repost ? '' :  'bg-white dark:bg-gray-950'} rounded-lg   ${className}`}>
            {/* <PostContext.Provider value={{ context, setContext }}> */}
                <PostHeader context={context} setContext={setContext} />

                <PostDate date={context.date} />

                <PostArticle context={context} setContext={setContext} />

                <PostMedia media={context.media} repost={context.repost} />

                {withReacts && <Reacts context={context} setContext={setContext} type={'post'} />}
            {/* </PostContext.Provider> */}
        </section>
    );
}

export default Post;