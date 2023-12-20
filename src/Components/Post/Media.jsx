import { useEffect, useRef } from 'react';
import vidLoader from '../../Assets/images/vidLoader.gif'
import { $, $a, uniqueID } from '../../js/cocktail';
import { mediaObserver } from '../../js/mediaObserver';
import tb from '../../js/tb';


function PostMedia({ media, repost }) {
    const mediaRef = useRef();
    const { images, vid, iframeSrc } = media;
    const videoRef = useRef();
    const imgRef = useRef();
    const vidConrolsRef = useRef();
    const figureRef = useRef();
    const playIconRef = useRef();
    const muteIconRef = useRef();
    const unId = uniqueID();

    useEffect(() => {
        mediaObserver.observe(mediaRef.current);
        if (videoRef.current && !videoRef.current.src) {
            setTimeout(async () => {
                videoRef.current.src = await tb.getFileFromBot(videoRef.current.getAttribute('tbid'));
            }, 1500)
        }

        $a(`#media-${unId} img`).forEach(img => {
            if (img.src) return;
            setTimeout(async () => {
                img.src = await tb.getFileFromBot(img.getAttribute('tbid'));
                const reloadImg = (ev) => {
                    ev.target.src = ev.target.src;
                }
                img.addEventListener('error', reloadImg)
            }, 1500)
        })
    }, []);

    const playAndPauseVideo = (ev) => {
        ev.stopPropagation();
        togglePlayAndPauseIcon(ev);
        videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
    };

    const toggleControlsRef = (ev) => {
        vidConrolsRef.current.classList.toggle('hidden');
    };

    const togglePlayAndPauseIcon = (ev) => {
        ev.stopPropagation();
        playIconRef.current.classList.toggle('fa-play');
    };

    const muteAndUnmute = (ev) => {
        ev.stopPropagation();
        muteIconRef.current.classList.toggle('fa-volume-xmark')
        videoRef.current.muted = videoRef.current.muted ? false : true;
    };

    const goFullScreen = (ev) => {
        ev.stopPropagation();
        videoRef.current.requestFullscreen();
        videoRef.current.setAttribute('fscreen', 'true');
        document.addEventListener('fullscreenchange', handleFsChange);
        toggleControls();
    };

    const toggleControls = () => {
        videoRef.current.controls = videoRef.current.controls ? false : true;
    };

    const handleFsChange = () => {
        if (!document.fullscreenElement) {
            toggleControls();
            document.removeEventListener('fullscreenchange', handleFsChange)
        }
    };

    const handleEndOfVideo = () => {
        videoRef.current.currentTime = 0;
        playIconRef.current.classList.toggle('fa-play');
    };

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
                                    <img ref={imgRef} tbid={tbid} className="max-w-full h-full max-h-[300px]" />
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
                                <figure ref={figureRef} onClick={toggleControlsRef} className={`relative snap-center w-full group  flex items-center justify-center flex-shrink-0  ${repost ? 'bg-white dark:bg-gray-950' : 'bg-[#eee] dark:bg-gray-900'} rounded-lg`} key={i}>
                                    <video tbid={tbid} ref={videoRef} muted={true} preload='auto' onError={() => { videoRef.current.load(); }} onPlay={() => { toggleControlsRef() }} onEnded={handleEndOfVideo} className=" rounded-lg w-full h-full " poster={vidLoader} />
                                    <ul ref={vidConrolsRef} className='absolute bottom-[5px] left-[5px] rounded-3xl w-fit p-2 bg-[#eee] dark:bg-gray-800 items-center gap-4 flex hidden transition-all'>
                                        <i ref={playIconRef} onClick={playAndPauseVideo} className='fa-solid fa-pause  text-[11px] font-bold cursor-pointer flex items-center justify-center w-[24px] h-[24px] rounded-full bg-gray-950'></i>
                                        <i ref={muteIconRef} onClick={muteAndUnmute} className="fa-solid fa-volume-high fa-volume-xmark text-[11px] font-bold cursor-pointer flex items-center justify-center w-[24px] h-[24px] rounded-full bg-gray-950"></i>
                                        <i onClick={goFullScreen} className="fa-solid fa-expand  text-[11px] font-bold cursor-pointer flex items-center justify-center w-[24px] h-[24px] rounded-full bg-gray-900"></i>
                                    </ul>
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