function PostMedia({media}) {
    return (
        <>
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
        </>
    );
}

export default PostMedia;