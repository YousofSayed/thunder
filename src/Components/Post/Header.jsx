import { useContext, useRef, useEffect } from "react";
import Button from "../Shared/Button";
import { getAllSheetValues, showMarquee, update } from "../../js/global";
import userAvatar from '../../Assets/images/user-avatar.png';
import User from "../Shared/UserThumbnail";
import { storeCtx } from "../../js/store";


function PostHeader({ context, setContext }) {
    // const { context, setContext } = useContext(PostContext)
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
    const {dispatch,state} = useContext(storeCtx);


    const postEdit = async () => {
        try {
            editeIconRef.classList.toggle('text-cyan-400');
            if (editeValue == content) {
                setContext({ ...context, showPostEditBtn: false });
                return;
            }
            post.postContent = editeValue;
            const res = await (await getAllSheetValues('posts')).replaceItemWithItem(post._id,post);
            setContext({ ...context, content: editeValue, showPostEditBtn: false });
            const renderData = res.data.slice(0,200).reverse()
            res.ok ? dispatch({type:'put',key:'posts',value:[...renderData]}) : '';
        } catch (error) {
            setTimeout(() => postEdit(), 1000)
            throw new Error(error.message);
        }
    }
    return (
        <header className={`relative flex justify-between items-center `}>
           <User userAvatar={userAvatar} profImgId={profImgId} userName={userName} className={'bg-white dark:bg-[#222]'}/>
            {showPostEditBtn && <Button clickCallback={postEdit}>Post</Button>}
        </header>
    );
}

export default PostHeader;