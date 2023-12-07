import { useEffect, useState } from "react";
import { $a, $, parse, getLocalDate, stringify } from "../js/cocktail";
import tb from "../js/tb";
import { update } from "../js/global";
import userAvatar from '../Assets/images/user-avatar.png';
import Reacts from "./Reacts";

function Post({ post }) {
    const { _id, userName, profImgId, email, userID, date, postContent, media, index, reacts, retweets } = post
    console.log('#######', index);
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

    const showMoreOrLess = (e) => {
        if (e.target.hasAttribute('open')) {
            e.target.removeAttribute('open')
            $(`#sumry-${index}`).classList.remove('hidden')
        } else {
            $(`#sumry-${index}`).classList.add('hidden')
        }
    }


    return (
        <section id={`post-${index}`} className="p-2 my-3 bg-gray-950 rounded-lg rtl ring-1">
            <header className="relative flex justify-between items-center">
                <figure className="w-fit flex gap-2 rounded-lg items-center px-2 py-1  bg-gray-900 ring-1">
                    <img src={userAvatar} id={profImgId} className="w-9 h-9 rounded-full cursor-pointer" />
                    <p className="font-bold">{userName}</p>
                </figure>
            </header>

            <article id="date" className="dark:text-gray-400 text-sm font-bold py-2">
                {date.split(',')[0] == getLocalDate() ? `Today , ${date.split(',')[1]}` : date}
            </article>

            <article id="postContent" className="my-2 pb-2 font-bold rounded-lg">
                {postContent.match(/\w+(\W+)?|.+/ig).slice(0, 50).join(' ')}

                {
                    postContent.match(/\w+(\W+)?|.+/ig).length > 50
                    &&
                    <details onClick={showMoreOrLess}>
                        <summary id={`sumry-${index}`} className="text-cyan-400">
                            Showmore
                        </summary>
                        {postContent.match(/\w+(\W+)?|.+/ig).slice(50).join(' ')}
                    </details>
                }
            </article>

            {
                media.images[0]
                &&
                <section id="images" className={`bg-gray-900 p-2 rounded-sm flex items-center gap-2`}>
                    {
                        media.images.map((imgId, i) => {
                            return (
                                <figure className="w-full flex items-center justify-center" key={i}>
                                    <img id={imgId} className=" rounded-sm" loading="lazy" />
                                </figure>
                            )
                        })
                    }
                </section>
            }

            {
                media.vid[0]
                &&
                <section id="video" className={`bg-gray-900 p-2 rounded-sm flex items-center gap-2`}>
                    {
                        media.vid.map((vidId, i) => {
                            return (
                                <figure className="w-full flex items-center justify-center" key={i}>
                                    <video id={vidId} className=" rounded-lg" controls />
                                </figure>
                            )
                        })
                    }
                </section>
            }

            {
                media.iframeSrc[0]
                &&
                <section id="iframe" className={`bg-gray-900 p-2 rounded-sm flex items-center gap-2 my-2 `}>
                    {
                        media.iframeSrc.map((src, i) => {
                            return (
                                <figure className="w-full flex items-center justify-center" key={i}>
                                    <iframe src={src + '&rel=0'} className=" rounded-sm h-[300px] w-full" loading="lazy" allowFullScreen={true}></iframe>
                                </figure>
                            )
                        })
                    }
                </section>
            }

            <Reacts index={index} _id={_id} reacts={reacts} retweets={retweets} userID={userID}/>
        </section>
    );
}

export default Post;