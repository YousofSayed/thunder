import { useContext } from "react";
import Button from "../Shared/Button";
import { PostContext } from "../Post";

function PostHeader({userAvatar , profImgId , userName}) {
    const {showPostEditBtn} = useContext(PostContext);
    
    return (
        <header className="relative flex justify-between items-center">
            <figure className="w-fit flex gap-2 rounded-lg items-center px-2 py-1  bg-gray-900 ring-1">
                <img src={userAvatar} id={profImgId} className="w-9 h-9 rounded-full cursor-pointer" />
                <p className="font-bold">{userName}</p>
            </figure>
            {showPostEditBtn && <Button children={'Post'}/>}
        </header>
    );
}

export default PostHeader;