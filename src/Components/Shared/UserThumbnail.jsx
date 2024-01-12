import { useEffect, useRef, useState } from "react";
import { thumbnailObserver } from "../../js/thumbnailObserver";
import userAvatar from '../../Assets/images/user-avatar.png';
import tb from "../../js/tb";

function UserThumbnail({ profImgId, userName, showName = true, className = 'text-black dark:text-white' }) {
    const thumbnailRef = useRef();
    useEffect(() => {
        if (thumbnailRef.current) thumbnailObserver.observe(thumbnailRef.current);
    });

    return (
        <figure className={`w-fit flex gap-2 rounded-lg items-center px-2  ${className}`}>
            <img ref={thumbnailRef} src={userAvatar} tbid={profImgId} className="w-[45px] h-[45px] rounded-full cursor-pointer " />
            <p className={`font-bold text-lg text-black dark:text-white ${showName ? '' : 'hidden sm:block'}`}>{userName}</p>
        </figure>
    );
}

export default UserThumbnail;