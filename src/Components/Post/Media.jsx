import { useEffect } from "react";
import { $, $a, uniqueID } from "../../js/cocktail";
import tb from "../../js/tb";
import vidLoader from '../../Assets/images/vidLoader.gif'

function PostMedia({ media , repost}) {
    const { images, vid, iframeSrc } = media;
    const mediaSecId = uniqueID();
    const observer = new IntersectionObserver((entries)=>{
        entries.forEach(async(vid)=>{
            if(vid.isIntersecting){
                // console.log(vid.target , vid.isIntersecting);
                vid.target.src = await tb.getFileFromBot(vid.target.getAttribute('tbid'));
                vid.target.poster = '';
                vid.target.controls = true;
                observer.unobserve(vid.target);
            }
        })
    })

    useEffect(()=>{
        $a(`#media-${mediaSecId} video`).forEach(vid=>{observer.observe(vid)})
        $a(`#media-${mediaSecId} img`).forEach(img=>{observer.observe(img)})
        // vid.forEach(vidId=>{observer.observe($(`#vidObs-${vidId}`))})
        // $a('.vidObs').forEach(vid => observer.observe(vid))
        // document.createElement('img').addEventListener
        // ('')
    })

    return (
        <section id={`media-${mediaSecId}`} className={`snap-x ${(images[0] || vid[0] || iframeSrc[0]) && `h-[300px]`}  snap-mandatory overflow-x-auto gap-4 flex`} dir="ltr">
            {
                images[0]
                &&
                <>
                    {
                        images.map((tbid, i) => {
                            return (
                                <figure className={`snap-center w-fit  flex items-center justify-center ${repost ? 'bg-white dark:bg-gray-950' : 'bg-[#eee] dark:bg-gray-900'} flex-shrink-0 rounded-lg `} key={i}>
                                    <img tbid={tbid}  className="max-w-[300px] max-h-[300px]" loading="lazy" />
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
                                    <video  tbid={tbid} className=" rounded-lg w-full h-full "  poster={vidLoader}  />
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