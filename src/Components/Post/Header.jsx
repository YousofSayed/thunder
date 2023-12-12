import { useContext, useRef, useEffect } from "react";
import Button from "../Shared/Button";
// import { PostContext } from "../Post";
import { showMarquee, update } from "../../js/global";
import userAvatar from '../../Assets/images/user-avatar.png';
import tb from "../../js/tb";


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

    useEffect(() => {
        (async () => {
            profImgRef.current.src = await (await tb.getFileFromBot(profImgId))
        })()
    }, []);

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
        <header className="relative flex justify-between items-center">
            <figure className="w-fit flex gap-2 rounded-lg items-center px-2 py-1  bg-gray-900 ring-1">
                <img ref={profImgRef} src={userAvatar} className="w-9 h-9 rounded-full cursor-pointer" />
                <p className="font-bold">{userName}</p>
            </figure>
            {showPostEditBtn && <Button clickCallback={postEdit}>Post</Button>}
        </header>
    );
}

export default PostHeader;