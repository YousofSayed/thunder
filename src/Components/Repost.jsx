import { useEffect, useState } from "react";
import PostHeader from "./Post/Header";
import PostDate from "./Post/Date";
import PostArticle from "./Post/Article";
import Post from "./Post";

function Repost({ repost, postSectionRef}) {
    const [context, setContext] = useState({
        ...repost,
        showPostEditBtn: false,
        editeValue: repost.repostContent,
        content: repost.repostContent,
        postSectionRef: postSectionRef,
    });


    return (
        <section className="w-full p-2 bg-white dark:bg-[#080808] dark:border-b dark:border-b-gray-700 rounded-lg ">
            <PostHeader context={context} setContext={setContext} />
            <PostDate date={context.date} />
            <PostArticle context={context} setContext={setContext} />
            {context.post && <Post post={context.post} className={`bg-[#eee] dark:bg-[#000] dark:ring-gray-700 ring-1`} postSectionRef={postSectionRef}  repost={repost} />}
        </section>
    );
}

export default Repost;