import { useContext } from "react";
import { CreatePostContext } from "../CreatePost";

function CreatePostMedia() {
    const { context, setContext } = useContext(CreatePostContext);
    const { imagesMedia, video, iframeSrc } = context;
    const deleteImg = (item) => {
        const newImagesMedia = imagesMedia.filter(e => e.blobURL != item.blobURL);
        setContext({ ...context, imagesMedia: newImagesMedia })
    }

    const deleteVideo = () => {
        setContext({ ...context, video: [] });
    }

    const deleteIframe = () => {
        setContext({ ...context, iframeSrc: [] });
    }

    return (
        <>
            {imagesMedia.length || video.length || iframeSrc.length ?
                <section className={`snap-x snap-mandatory ${(imagesMedia[0] || video[0] || iframeSrc[0]) && `h-[300px]`} overflow-x-auto gap-4 flex mt-3 py-3`} id='media'>
                    {imagesMedia.map((srcs, i) => {
                        return (
                            <figure className='snap-start w-fit relative flex items-center justify-center bg-gray-900 flex-shrink-0' key={i}>
                                <img src={srcs.blobURL} className='rounded-lg p-2 max-w-[300px] max-h-[300px] bg-gray-950' />
                                <i
                                    className='fa-solid fa-x w-[25px] h-[25px] rounded-full cursor-pointer text-cyan-300 bg-gray-950 text-[14px] flex justify-center items-center absolute right-[-10px] top-[-10px]'
                                    onClick={() => { deleteImg(srcs) }}
                                ></i>
                            </figure>
                        )
                    })}

                    {
                        video.map((vid, i) => {
                            return (
                                <figure className='relative snap-start w-[95%]  flex items-center justify-center flex-shrink-0 bg-gray-900' key={i} >
                                    <video className='rounded-lg w-full h-full' src={vid.blobURL} controls />
                                    <i
                                        className='fa-solid fa-x w-[25px] h-[25px] rounded-full cursor-pointer text-cyan-300 bg-gray-950 text-[14px] flex justify-center items-center absolute right-[-10px] top-[-10px]'
                                        onClick={deleteVideo}
                                    ></i>
                                </figure>
                            )
                        })
                    }


                    {iframeSrc.map((src, i) => {
                        return (
                            <figure key={i} className='relative snap-start flex items-center justify-center w-[95%] flex-shrink-0'>
                                <iframe src={src} className='rounded-lg w-full h-full'></iframe>
                                <i
                                    className='fa-solid fa-x w-[25px] h-[25px] rounded-full cursor-pointer text-cyan-300 bg-gray-950 text-[14px] flex justify-center items-center absolute right-[-10px] top-[-10px]'
                                    onClick={deleteIframe}
                                ></i>
                            </figure>
                        )
                    })}
                </section>

                :
                null
            }
        </>
    );
}

export default CreatePostMedia;