import { createContext, useEffect, useState } from "react";
import { $a, $, parse, getLocalDate, stringify } from "../js/cocktail";
import tb from "../js/tb";
import { update } from "../js/global";
import Reacts from "./Post/Reacts";
import PostHeader from "./Post/Header";
import PostArticle from "./Post/Article";
import PostDate from "./Post/Date";
import PostMedia from "./Post/Media";
// export const PostContext = createContext();

function Post({ post, className, withReacts }) {
    const { postContent, index } = post
    const [context, setContext] = useState({
        showPostEditBtn: false,
        editeValue: postContent,
        content: postContent,
        post,
        ...post
    });

    const user = parse(localStorage.getItem('user'));

    useEffect(() => {
        getImagesAndVideos();
    });

    const getImagesAndVideos = () => {
        $a(`#post-${index} img`).forEach(async (img) => {
            if (!img.id) return;
            img.src = await tb.getFileFromBot(img.id)
        })
        $a(`#post-${index} video`).forEach(async (vid) => vid.src = await tb.getFileFromBot(vid.id))
    }


    return (
        <section id={`post-${index}`} className={`p-2 my-3 bg-gray-950 rounded-lg rtl ring-1 ${className}`}>
            {/* <PostContext.Provider value={{ context, setContext }}> */}
            <PostHeader context={context} setContext={setContext} />

            <PostDate date={context.date} />

            <PostArticle context={context} setContext={setContext} />

            <PostMedia media={context.media} />

            {withReacts && <Reacts context={context} setContext={setContext} />}
            {/* </PostContext.Provider> */}
        </section>
    );
}

export default Post;