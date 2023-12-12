import { useState } from "react";
import PostHeader from "./Post/Header";
import PostDate from "./Post/Date";
import PostArticle from "./Post/Article";
import Post from "./Post";
import Reacts from "./Post/Reacts";

function Repost({ repost, postSectionRef }) {
    const [context, setContext] = useState({
        ...repost,
        showPostEditBtn: false,
        editeValue: repost.repostContent,
        content: repost.repostContent,
        postSectionRef: postSectionRef,
    });

    return (
        <section className="w-full p-2 bg-gray-950 rounded-lg ring-1">
            <PostHeader context={context} setContext={setContext}/>
            <PostDate date={context.date}  />
            <PostArticle  context={context} setContext={setContext}/>
            <Post post={context.post} postSectionRef={postSectionRef}  withReacts={true} repost={repost}/>
        </section>
    );
}

export default Repost;