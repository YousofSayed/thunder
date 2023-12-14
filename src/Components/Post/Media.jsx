import { useEffect, useRef } from 'react';
import vidLoader from '../../Assets/images/vidLoader.gif'
import { uniqueID } from '../../js/cocktail';
import { mediaObserver } from '../../js/mediaObserver';

function PostMedia({ media, repost }) {
    const mediaRef = useRef();
    const { images, vid, iframeSrc } = media;
    const unId = uniqueID();

    useEffect(() => {
        mediaObserver.observe(mediaRef.current);
    });

    return (
        <section id={`media-${unId}`} ref={mediaRef} className={`snap-x ${(images[0] || vid[0] || iframeSrc[0]) && `h-[300px]`} hide-scrollbar  snap-mandatory overflow-x-auto gap-4 flex`} dir="ltr">
            {
                images[0]
                &&
                <>
                    {
                        images.map((tbid, i) => {
                            return (
                                <figure className={`snap-center ${images.length > 1 ? 'w-[90%] sm:w-[40%]' : 'w-full'} h-[300px] flex items-center justify-center ${repost ? 'bg-white dark:bg-gray-950' : 'bg-[#eee] dark:bg-gray-900'} flex-shrink-0 rounded-lg `} key={i}>
                                    <img tbid={tbid} className="max-w-full h-full max-h-[300px]" loading="lazy" />
                                </figure>
                            )
                        })
                    }
                </>
            }

            {
                vid[0]
                &&
                <>
                    {
                        vid.map((tbid, i) => {

                            return (
                                <figure className={`snap-center w-full  flex items-center justify-center flex-shrink-0 ${repost ? 'bg-white dark:bg-gray-950' : 'bg-[#eee] dark:bg-gray-900'} rounded-lg`} key={i}>
                                    <video tbid={tbid} className=" rounded-lg w-full h-full " autoPlay={true} muted={true} poster={vidLoader} />
                                </figure>
                            )
                        })
                    }
                </>
            }

            {
                iframeSrc[0]
                &&
                <>
                    {
                        iframeSrc.map((src, i) => {
                            return (
                                <figure className={`snap-center flex items-center ${repost ? 'bg-white dark:bg-gray-950' : 'bg-[#eee] dark:bg-gray-900'} justify-center w-full flex-shrink-0`} key={i}>
                                    <iframe src={src + '&rel=0'} className=" rounded-lg w-full h-full" loading="lazy" allowFullScreen={true}></iframe>
                                </figure>
                            )
                        })
                    }
                </>
            }
        </section>
    );
}

export default PostMedia;