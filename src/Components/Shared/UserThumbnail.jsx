import { useEffect, useRef, useState } from "react";
import tb from "../../js/tb";
import { thumbnailObserver } from "../../js/thumbnailObserver";

function UserThumbnail({ profImgId, userAvatar, userName, showName = true, className = 'text-black dark:text-white' }) {
    const thumbnailRef = useRef();
    useEffect(() => {
        if (thumbnailRef.current) thumbnailObserver.observe(thumbnailRef.current);
    });

    return (
        <figure className={`w-fit flex gap-2 rounded-lg items-center px-2  ${className}`}>
            <img ref={thumbnailRef} src={userAvatar} tbid={profImgId} className="max-w-[45px] max-h-[40px] rounded-full cursor-pointer " />
            {showName && <p className="font-bold">{userName}</p>}
        </figure>
    );
}

export default UserThumbnail;