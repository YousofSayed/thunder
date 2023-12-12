import { useEffect, useRef, useState } from "react";
import tb from "../../js/tb";

function PostMedia({ media }) {

    return (
        <section className="snap-x h-[300px] snap-mandatory overflow-x-auto gap-4 flex" dir="ltr">
            {
                media.images[0]
                &&
                // <section id="images" className={`bg-gray-900 p-2 rounded-sm flex items-center gap-2`}>
                <>
                    {
                        media.images.map((id, i) => {
                            return (
                                <figure className="snap-start w-fit  flex items-center justify-center bg-gray-900 flex-shrink-0 " key={i}>
                                    <img id={id} className=" rounded-sm max-w-[300px] max-h-[300px]" loading="lazy" />
                                </figure>
                            )
                        })
                    }
                </>
                // </section>
            }

            {
                media.vid[0]
                &&
                // <section id="video" className={`bg-gray-900 p-2 rounded-sm flex items-center gap-2`}>
                <>
                    {
                        media.vid.map((id, i) => {
                            return (
                                <figure className="snap-start w-fit  flex items-center justify-center flex-shrink-0 bg-gray-900" key={i}>
                                    <video id={id} className=" rounded-lg w-full h-full w-[400px]" controls />
                                </figure>
                            )
                        })
                    }
                </>
                // </section>
            }

            {
                media.iframeSrc[0]
                &&
                // <section id="iframe" className={`bg-gray-900 p-2 rounded-sm flex items-center gap-2 my-2 `}>
                <>
                    {
                        media.iframeSrc.map((src, i) => {
                            return (
                                <figure className="snap-start flex items-center justify-center w-fit flex-shrink-0" key={i}>
                                    <iframe src={src + '&rel=0'} className=" rounded-sm h-[300px] w-full" loading="lazy" allowFullScreen={true}></iframe>
                                </figure>
                            )
                        })
                    }
                </>
                // </section>
            }
        </section>
    );
}

export default PostMedia;