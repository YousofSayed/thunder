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
                <section className='w-full p-4 flex  flex-wrap justify-between gap-2 items-center bg-gray-900 mt-3 rounded-lg' id='media'>
                    {imagesMedia.map((srcs, i) => {
                        return (
                            <figure className='w-[100px] h-[100px] flex justify-center items-center  rounded-lg relative' key={i}>
                                <img src={srcs.blobURL} className='rounded-lg p-2 bg-gray-950' />
                                <i
                                    className='fa-solid fa-x w-[25px] h-[25px] rounded-full cursor-pointer text-cyan-300 bg-gray-950 text-[14px] flex justify-center items-center absolute right-[-10px] top-[-10px]'
                                    onClick={() => { deleteImg(srcs) }}
                                ></i>
                            </figure>
                        )
                    })}

                    <section className='flex gap-3 sm:flex-row flex-col'>
                        {
                            video.map((vid, i) => {
                                return (
                                    <figure className='relative w-full' key={i} >
                                        <video className='rounded-lg m-auto bg-gray-950 p-2 max-h-[500px] w-full' src={vid.blobURL} controls />
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
                                <figure key={i} className='relative w-full'>
                                    <iframe src={src} className='rounded-lg m-auto bg-gray-950 p-2 h-full max-h-[500px] w-full'></iframe>
                                    <i
                                        className='fa-solid fa-x w-[25px] h-[25px] rounded-full cursor-pointer text-cyan-300 bg-gray-950 text-[14px] flex justify-center items-center absolute right-[-10px] top-[-10px]'
                                        onClick={deleteIframe}
                                    ></i>
                                </figure>
                            )
                        })}
                    </section>

                </section>
                :
                null
            }
        </>
    );
}

export default CreatePostMedia;