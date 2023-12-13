import { createContext, useEffect, useRef, useState } from "react";
import { $a, $, parse, getLocalDate, stringify } from "../js/cocktail";
import tb from "../js/tb";
import Reacts from "./Post/Reacts";
import PostHeader from "./Post/Header";
import PostArticle from "./Post/Article";
import PostDate from "./Post/Date";
import PostMedia from "./Post/Media";
export const PostContext = createContext();

function Post({ post, className, posts, setPosts, withReacts, postSectionRef, repost }) {
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

    useEffect(() => {
        getImagesAndVideos();
    });

    useEffect(()=>{
        setContext({...context , postRef:postRef.current})
    },[])

    const getImagesAndVideos = () => {
        // $a(`#post-${index} img`).forEach(async (img) => {
        //     if (!img.id || img.src) return;
        //     img.src = await tb.getFileFromBot(img.id)
        // })
        // $a(`#post-${index} video`).forEach(async (vid) => {
        //     if (!vid.id || vid.src) return;
        //     vid.src = await tb.getFileFromBot(vid.id)
        // })
    }


    return (
        <section id={`post-${index}`} ref={postRef} className={`w-full p-2  ${repost ? '' :  'bg-white dark:bg-gray-950'} rounded-lg  ring-1 ${className}`}>
            <PostContext.Provider value={{ context, setContext }}>
                <PostHeader context={context} setContext={setContext} />

                <PostDate date={context.date} />

                <PostArticle context={context} setContext={setContext} />

                <PostMedia media={context.media} repost={context.repost} />

                {withReacts && <Reacts context={context} setContext={setContext} type={'post'} />}
            </PostContext.Provider>
        </section>
    );
}

export default Post;