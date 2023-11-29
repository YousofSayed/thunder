import { $, get, getCurrentTime, parse, parseToHTML, stringify } from '../js/cocktail';
import { useEffect, useState } from 'react';
import { append, showMarquee } from '../js/global';
import tb from '../js/tb';

function CreatePost() {
    const [imagesMedia, setImagesMedia] = useState([]);
    const [charLength, setcharLength] = useState(0);
    const [postContent, setPostContent] = useState(null);
    const [video, setVideo] = useState([]);
    const [iframeInputValue, setIframeInputValue] = useState(null)
    const [iframeSrc, setIframeSrc] = useState([]);
    const user = parse(localStorage.getItem('user'));

    const uploadImages = async (e) => {
        const { files } = e.target;
        $('#postContent').classList.remove('min-h-[300px]')
        if (files.length > 4) { alert(`Max image number is 4`); return }
        const urls = [];
        for (const file of files) {
            urls.push({ blobURL: URL.createObjectURL(file), file })
        }
        setImagesMedia(urls);
    }

    const uploadVideo = async (e) => {
        const file = e.target.files[0];
        if ((file.size / 1000000) >= 50) { alert(`Maximum size is 50MB`); return }
        $('#postContent').classList.remove('min-h-[300px]')
        setVideo([{ blobURL: URL.createObjectURL(file), file }])
    }

    const uploadIframe = () => {
        const parsedIframeSrc = parseToHTML(iframeInputValue).src;
        $('#iframeSection').classList.add('hidden');
        setIframeSrc([parsedIframeSrc]);
    }

    const deleteImg = (item) => {
        const newImagesMedia = imagesMedia.filter(e => e.blobURL != item.blobURL);
        setImagesMedia(newImagesMedia);
    }

    const deleteVideo = () => {
        setVideo([])
    }

    const deleteIframe = () => {
        setIframeSrc([])
    }

    const limitChars = (ev) => {
        if (+ev.target.value.length > 5000) { ev.target.value = postContent; return }
        setcharLength(ev.target.value.length)
        setPostContent(ev.target.value)
    }

    const fitAndShrinkContetntArea = (ev) => {
        const { classList } = ev.target
        classList.contains('fa-expand') ? ev.target.classList.replace('fa-expand', 'fa-compress') : ev.target.classList.replace('fa-compress', 'fa-expand')
        $('#postContent').classList.contains('min-h-[300px]') ? $('#postContent').classList.remove('min-h-[300px]') : $('#postContent').classList.add('min-h-[300px]')
    }

    const postThePost = async () => {
        try {
            if (!postContent) {
                alert(`Enter content to post`);
                return;
            }
            showMarquee(true);
            const images = [], vid = [];

            if (imagesMedia[0]) {

                for (const item of imagesMedia) {
                    const res = await (await tb.sendImage(item.file)).id
                    images.push(res)
                }
            }

            if (video[0]) {
                for (const item of video) {
                    vid.push(await (await tb.sendVideo(item.file)).id)
                }
            }

            const postData = stringify({
                name: user.name,
                userID: user.id,
                date: getCurrentTime(),
                email: user.email,
                profImgId: user.profImgId,
                postContent,
                media: {
                    images,
                    vid,
                    iframeSrc
                }
            })

            const res = await append('Posts', postData);
            $('#postContent').value = '';
            $('#iframeInput').value = '';
            setPostContent('');
            setcharLength(0);
            setImagesMedia([]);
            setVideo([]);
            setIframeSrc([]);
            showMarquee(false);
        } catch (error) {
            await postThePost();
            throw new Error(error.message);
        }
    }

    return (
        <section className='flex ring-1 flex-col bg-gray-950 mt-2 h-fit rounded-lg p-2'>
            <header className='flex items-center justify-between'>
                <div className='w-[25px] h-[25px] border-4 rounded-full border-cyan-400 border-l-transparent animate-spin hidden'></div>
            </header>

            <section className='relative overflow-y-auto  max-h-[400px] h-fit mt-3'>
                <i onClick={fitAndShrinkContetntArea} className="fa-solid fa-expand  absolute ltr:right-[5px] rtl:left-[5px] top-[5px] cursor-pointer p-2 flex items-center justify-center rounded-full bg-gray-950 "></i>
                <textarea
                    id='postContent'
                    onInput={limitChars}
                    className=' w-full font-medium break-words outline-none bg-gray-900 p-2 pr-[30px] rounded-lg resize-none transition-all'
                    placeholder='What is in your mind?'

                ></textarea>
            </section>

            <section id='iframeSection' className='flex hidden items-center gap-2 h-full'>
                <input id='iframeInput' className='w-full p-2 outline-none bg-gray-900 my-2 rounded-lg text-cyan-400 underline' type="text" placeholder='Enter Iframe' onInput={(e) => { setIframeInputValue(e.target.value) }} />
                <button className='w-[50px] h-full bg-cyan-600 rounded-lg p-2 font-bold' onClick={uploadIframe}>OK</button>
            </section>

            {imagesMedia[0] || video[0] || iframeSrc[0] ?
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

            <section className='p-2 w-full  mt-3 flex justify-between'>
                <ul className='flex items-center h-full gap-4'>
                    <i className="fa-regular fa-image cursor-pointer transition-all text-cyan-400 text-lg" onClick={() => { $('#fImages').click() }}><input type="file" className='hidden' id='fImages' accept='image/*' onChange={uploadImages} multiple={true} /></i>
                    <i className="fa-solid fa-film cursor-pointer transition-all text-cyan-400 text-lg" onClick={() => { $('#fVideos').click() }}><input type="file" className='hidden' id='fVideos' accept='video/*' onChange={uploadVideo} /></i>
                    <i className='fa-solid fa-link cursor-pointer transition-all text-cyan-400 text-lg' onClick={() => { $('#iframeSection').classList.toggle('hidden') }}></i>
                    <span className='p-2 bg-cyan-500 font-bold rounded-lg '>{charLength}/5000</span>
                </ul>
                <button className='px-2 py-1 bg-cyan-600 rounded-md font-bold' onClick={postThePost}>POST</button>
            </section>
        </section>

    );
}

export default CreatePost;