import { useContext, useRef, useEffect } from "react";
import Button from "../Shared/Button";
// import { PostContext } from "../Post";
import { showMarquee, update } from "../../js/global";
import userAvatar from '../../Assets/images/user-avatar.png';
import tb from "../../js/tb";
import User from "../Shared/User";


function PostHeader({ context, setContext }) {
    // const { context, setContext } = useContext(PostContext)
    const profImgRef = useRef();
    const {
        showPostEditBtn,
        content,
        editeValue,
        editeIconRef,
        userName,
        profImgId,
        repost,
        post
    } = context;


    const postEdit = async () => {
        try {
            showMarquee(true);
            editeIconRef.classList.toggle('text-cyan-400');
            if (editeValue == content) {
                showMarquee(false);
                setContext({ ...context, showPostEditBtn: false });
                return;
            }
            post.postContent = editeValue;
            const upd = await update(`Posts!A${post.index}`, { type: 'post', schema: post });
            repost ? await update(`Posts!A${repost.index}`, { type: 'repost', schema: { ...repost, post: post } }) : null;
            setContext({ ...context, content: editeValue, showPostEditBtn: false });
            showMarquee(false);
        } catch (error) {
            setTimeout(() => postEdit(), 1000);
            throw new Error(error.message);
        }
    }
    return (
        <header className={`relative flex justify-between items-center `}>
           <User userAvatar={userAvatar} profImgId={profImgId} userName={userName} className={repost ? 'bg-white dark:bg-gray-950' : 'bg-[#eee] dark:bg-gray-900'}/>
            {showPostEditBtn && <Button clickCallback={postEdit}>Post</Button>}
        </header>
    );
}

export default PostHeader;