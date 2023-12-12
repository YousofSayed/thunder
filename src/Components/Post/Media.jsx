
function PostMedia({ media }) {
    const { images, vid, iframeSrc } = media;
    return (
        <section className={`snap-x ${(images[0] || vid[0] || iframeSrc[0]) && `h-[300px]`} snap-mandatory overflow-x-auto gap-4 flex`} dir="ltr">
            {
                images[0]
                &&
                <>
                    {
                        images.map((id, i) => {
                            return (
                                <figure className="snap-start w-fit  flex items-center justify-center bg-gray-900 flex-shrink-0 " key={i}>
                                    <img id={id} className=" rounded-sm max-w-[300px] max-h-[300px]" loading="lazy" />
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
                        vid.map((id, i) => {
                            return (
                                <figure className="snap-start w-fit  flex items-center justify-center flex-shrink-0 bg-gray-900" key={i}>
                                    <video id={id} className=" rounded-lg w-full h-full " controls />
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
                                <figure className="snap-start flex items-center justify-center w-fit flex-shrink-0" key={i}>
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