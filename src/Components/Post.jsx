import { createContext, useEffect, useState } from "react";
import { $a, $, parse, getLocalDate, stringify } from "../js/cocktail";
import tb from "../js/tb";
import { update } from "../js/global";
import userAvatar from '../Assets/images/user-avatar.png';
import Reacts from "./Reacts";
import PostHeader from "./Post/Header";
import PostArticle from "./Post/Article";
import PostDate from "./Post/Date";
import PostMedia from "./Post/Media";
export const PostContext = createContext();

function Post({ post }) {
    const [showPostEditBtn, setShowPostEditBtn] = useState(false);
    const [editeValue , setEditValue] = useState('');
    const context =
    {
        showPostEditBtn, setShowPostEditBtn,
        editeValue , setEditValue,
    }
    const { _id, userName, profImgId, email, userID, date, postContent, media, index, reacts, retweets } = post
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
        <section id={`post-${index}`} className="p-2 my-3 bg-gray-950 rounded-lg rtl ring-1">
            <PostContext.Provider value={context}>
                <PostHeader userAvatar={userAvatar} userName={userName} profImgId={profImgId} />

                <PostDate date={date} />

                <PostArticle postContent={postContent} index={index} />

                <PostMedia media={media} />

                <Reacts index={index} _id={_id} reacts={reacts} retweets={retweets} userID={userID} />
            </PostContext.Provider>
        </section>
    );
}

export default Post;