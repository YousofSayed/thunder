import { useEffect, useState } from "react";
import PostHeader from "./Post/Header";
import PostDate from "./Post/Date";
import PostArticle from "./Post/Article";
import Post from "./Post";

function Repost({ repost, postSectionRef }) {
    const [context, setContext] = useState({
        ...repost,
        showPostEditBtn: false,
        editeValue: repost.repostContent,
        content: repost.repostContent,
        postSectionRef: postSectionRef,
    });


    return (
        <section className="w-full p-2 bg-white dark:bg-gray-950 rounded-lg ring-1">
            <PostHeader context={context} setContext={setContext} />
            <PostDate date={context.date} />
            <PostArticle context={context} setContext={setContext} />
            {context.post && <Post post={context.post} className={`bg-[#eee] dark:bg-gray-900`} postSectionRef={postSectionRef} withReacts={true} repost={repost} />}
        </section>
    );
}

export default Repost;