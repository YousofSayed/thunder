import { useEffect, useRef } from "react";
import tb from "../../js/tb";

function User({profImgId , userAvatar , userName , className}) {
    const profImgRef = useRef();
    useEffect(() => {
        (async () => {
            profImgRef.current.src = await (await tb.getFileFromBot(profImgId))
        })()
    }, []);

    return (
        <figure className={`w-fit flex gap-2 rounded-lg items-center px-2 py-1ring-1 text-black dark:text-white ${className}`}>
            <img ref={profImgRef} src={userAvatar} className="w-9 h-9 rounded-full cursor-pointer" />
            <p className="font-bold">{userName}</p>
        </figure>
    );
}

export default User;