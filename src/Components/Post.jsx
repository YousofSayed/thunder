import { useEffect, useState } from "react";
import { $a, $, parse, getLocalDate } from "../js/cocktail";
import tb from "../js/tb";

let isPopupGlobal;
window.addEventListener('click', (e) => {
    const { target } = e;
    if (target.id == 'popup' || target.parentNode.id == 'popup' || target.parentNode.parentNode.id == 'popup' || target.id == 'popupHandler') {
        return
    } else {
        $a('#popup').forEach((popup) => popup.remove());
        isPopupGlobal = false;
    }
})


function Post({ data }) {
    const [isPopup ,setIsPopup] = useState(false)
    data = parse(data);
    const { name, profImgId, email, userId, date, postContent, media, index } = data
    console.log(data);
    useEffect(() => {
        getImages()
    });

    const getImages = () => {
        $a(`#post-${index} img`).forEach(async (img) => img.src = await tb.getFileFromBot(img.id))
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

    const showPopup = () => {
        isPopupGlobal = isPopupGlobal ? false : true;
        setIsPopup(isPopupGlobal)
        // isPopup ? setIsPopup(false) : setIsPopup(true);
    }


    return (
        <section id={`post-${index}`} className="p-2 my-3 bg-gray-950 rounded-lg rtl ring-1">
            <header className="relative flex justify-between items-center">
                <figure className="w-fit flex gap-2 rounded-lg items-center px-2 py-1  bg-gray-900 ">
                    <img id={profImgId} className="w-9 h-9 rounded-full cursor-pointer" />
                    <p className="font-bold">{name}</p>
                </figure>

                <i id="popupHandler" className="fa-solid fa-ellipsis text-xl cursor-pointer" onClick={() => { showPopup() }}></i>

                {
                    isPopup
                    &&
                    <ul id="popup" className="flex flex-col z-10 gap-2 p-2 rounded-lg absolute right-[7px] top-[35px] bg-gray-900">
                        <li className="flex items-center gap-3 font-bold py-1 cursor-pointer bg-gray-950 p-2 rounded-lg"><i className="fa-solid fa-pen-to-square text-lg "></i> Edit</li>
                        <li className="flex items-center gap-3 font-bold py-1 cursor-pointer bg-gray-950 p-2 rounded-lg"><i className="fa-solid fa-bookmark text-lg "></i> Save</li>
                        <li className="flex items-center gap-3 font-bold py-1 cursor-pointer bg-gray-950 p-2 rounded-lg"><i className="fa-solid fa-flag text-lg "></i> Report</li>
                        <li className="flex items-center gap-3 font-bold py-1 cursor-pointer bg-gray-950 p-2 rounded-lg"><i className="fa-solid fa-trash text-red-500 text-lg"></i> Delete</li>
                    </ul>
                }
            </header>

            <article className="dark:text-gray-400 text-sm font-bold py-3">
                {date.split(',')[0] == getLocalDate() ? `Today , ${date.split(',')[1]}` : date}
            </article>

            <article className="p-2 my-2 font-bold rounded-lg">
                {postContent.match(/\w+(\W+)?/ig).slice(0, 50).join(' ')}

                {
                    postContent.match(/\w+/ig).length > 50
                    &&
                    <details onClick={showMoreOrLess}>
                        <summary id={`sumry-${index}`} className="text-cyan-400">
                            Showmore
                        </summary>
                        {postContent.match(/\w+/ig).slice(50).join(' ')}
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
                                    <video id={vidId} className=" rounded-sm" controls />
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
                                    <iframe src={src} className=" rounded-sm h-[300px] w-full" loading="lazy"></iframe>
                                </figure>
                            )
                        })
                    }
                </section>
            }

            <section className="mt-2 p-2 bg-gray-900 rounded-lg w-fit">
                <i className="fa-regular fa-heart cursor-pointer text-lg hover:text-cyan-400 transition-all"></i>
                <i className="fa-solid fa-retweet ml-8 cursor-pointer text-lg hover:text-cyan-400 transition-all"></i>
            </section>
        </section>
    );
}

export default Post;