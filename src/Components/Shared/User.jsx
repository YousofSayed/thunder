import { useEffect, useRef } from "react";
import tb from "../../js/tb";

function User({ profImgId, userAvatar, userName, className }) {
    const profImgRef = useRef();
    useEffect(() => {
        if (profImgRef.current && profImgId) {
            setTimeout(async () => {
                profImgRef.current.src = await (await tb.getFileFromBot(profImgId))
            }, 100)
        }
    }, []);

    return (
        <figure className={`w-fit flex gap-3   rounded-lg items-center px-2  text-black dark:text-white ${className}`}>
            <img ref={profImgRef} src={userAvatar} className="w-9 h-9 rounded-full cursor-pointer ring-2" />
            <p className="font-bold">{userName}</p>
        </figure>
    );
}

export default User;