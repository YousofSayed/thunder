import { useEffect } from "react";
import { $a, $, parse } from "../js/cocktail";
import tb from "../js/tb";

function Post({ data }) {
    data = parse(data);
    const { name, profImgId, email, postContent, media, index } = data
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
            $(`#sumry-${index}`).textContent = 'Showmore';
        } else {
            $(`#sumry-${index}`).textContent = 'Showless';

        }
    }
    return (
        <section id={`post-${index}`} className="p-2 my-3 bg-gray-950 rounded-lg rtl ring-1">
            <header className="w-fit flex gap-2 rounded-lg items-center px-2 py-1 bg-gray-900 ring-1">
                <img id={profImgId} className="w-9 h-9 rounded-full cursor-pointer" />
                <p className="font-bold">{name}</p>
            </header>

            <article className="p-2 my-2 font-bold bg-gray-900 rounded-lg">
                {postContent.match(/\w+/ig).slice(0, 50).join(' ')}
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
                                    <img id={imgId} className=" rounded-sm" />
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
                                    <iframe src={src} className=" rounded-sm h-[300px] w-full"></iframe>
                                </figure>
                            )
                        })
                    }
                </section>
            }
        </section>
    );
}

export default Post;