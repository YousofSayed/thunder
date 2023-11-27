import { $, get, parse, parseToHTML, stringify } from '../js/cocktail';
import { useEffect, useState } from 'react';

function Posts() {
    const [imagesMedia, setImagesMedia] = useState([]);
    const [charLength, setcharLength] = useState(0);
    const [postContent, setPostContent] = useState(null);
    const [video, setVideo] = useState([]);
    const [iframeInputValue, setIframeInputValue] = useState(null)
    const [iframeSrc, setIframeSrc] = useState('');

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
        $('#postContent').classList.remove('min-h-[300px]')
        setVideo([{ blobURL: URL.createObjectURL(file), file }])
    }

    const uploadIframe = () => {
        const parsedIframeSrc = parseToHTML(iframeInputValue).src;
        $('#iframeInput').classList.add('hidden');
        setIframeSrc([parsedIframeSrc]);
    }

    const deleteImg = (item) => {
        const newImagesMedia = imagesMedia.filter(e => e.blobURL != item.blobURL);
        setImagesMedia(newImagesMedia);
    }

    const deleteVideo = () => {
        setVideo([])
    }

    const deleteIframe = ()=>{
        setIframeSrc([])
    }

    const limitChars = (ev) => {
        if (+ev.target.value.length > 45000) { ev.target.value = postContent; return }
        setcharLength(ev.target.value.length)
        setPostContent(ev.target.value)
    }

    const fitAndShrinkContetntArea = (ev) => {
        const { classList } = ev.target
        classList.contains('fa-expand') ? ev.target.classList.replace('fa-expand', 'fa-compress') : ev.target.classList.replace('fa-compress', 'fa-expand')
        $('#postContent').classList.contains('min-h-[300px]') ? $('#postContent').classList.remove('min-h-[300px]') : $('#postContent').classList.add('min-h-[300px]')
    }

    const postThePost = async () => {

    }
    return (
        <>
            <section className='h-full container bg-gray-900 rounded-lg shadow-xl p-2 overflow-auto scrollBar'>
                <header className="w-full items-center gap-2 bg-gray-950 p-2 rounded-lg hidden md:flex">
                    <input type="search" className=" w-full bg-transparent font-bold outline-none" placeholder="Search" title="search input" />
                    <i className="fa-solid  fa-search text-1xl text-white" title='search icon'></i>
                </header>

                <main className='flex flex-col bg-gray-950 mt-2 h-fit rounded-lg p-2'>
                    <header className='flex items-center justify-between'>
                        <div className='w-[25px] h-[25px] border-4 rounded-full border-cyan-400 border-l-transparent animate-spin hidden'></div>
                    </header>

                    <section className='relative overflow-y-auto  max-h-[400px] h-fit mt-3'>
                        <i onClick={fitAndShrinkContetntArea} className="fa-solid fa-expand  absolute right-[5px] top-[5px] cursor-pointer p-2 flex items-center justify-center rounded-full bg-gray-950 "></i>
                        <textarea
                            id='postContent'
                            onInput={limitChars}
                            className=' w-full font-medium break-words outline-none bg-gray-900 p-2 pr-[30px] rounded-lg resize-none transition-all'
                            placeholder='What is in your mind?'

                        ></textarea>
                    </section>

                    <section id='iframeInput' className='flex hidden items-center gap-2 h-full'>
                        <input className='w-full p-2 outline-none bg-gray-900 my-2 rounded-lg text-cyan-400 underline' type="text" placeholder='Enter Iframe' onInput={(e) => { setIframeInputValue(e.target.value) }} />
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
                                        <iframe src={src} className='rounded-lg m-auto bg-gray-950 p-2 h-[320px] max-h-[500px] w-full'></iframe>
                                        <i
                                            className='fa-solid fa-x w-[25px] h-[25px] rounded-full cursor-pointer text-cyan-300 bg-gray-950 text-[14px] flex justify-center items-center absolute right-[-10px] top-[-10px]'
                                            onClick={deleteIframe}
                                        ></i>
                                    </figure>
                                )
                            })}
                            {/* <iframe className='rounded-lg m-auto bg-gray-950 p-2 h-[300px] max-h-[500px] w-full' src="https://www.youtube-nocookie.com/embed/f0oy-NicIgE?modestbranding=1&;showinfo=0&;autohide=1&;rel=0" frameborder="0"></iframe> */}
                        </section>
                        :
                        null
                    }

                    <section className='p-2 w-full  mt-3 flex justify-between'>
                        <ul className='flex items-center h-full gap-4'>
                            <i className="fa-regular fa-image cursor-pointer transition-all text-cyan-400 text-lg" onClick={() => { $('#fImages').click() }}><input type="file" className='hidden' id='fImages' accept='image/*' onChange={uploadImages} multiple={true} /></i>
                            <i className="fa-solid fa-film cursor-pointer transition-all text-cyan-400 text-lg" onClick={() => { $('#fVideos').click() }}><input type="file" className='hidden' id='fVideos' accept='video/*' onChange={uploadVideo} /></i>
                            <i className='fa-solid fa-link cursor-pointer transition-all text-cyan-400 text-lg' onClick={() => { $('#iframeInput').classList.toggle('hidden') }}></i>
                            <span className='p-2 bg-cyan-500 font-bold rounded-lg '>{charLength}/45000</span>
                        </ul>
                        <button className='px-2 py-1 bg-cyan-600 rounded-md font-bold '>POST</button>
                    </section>
                </main>
            </section>
        </>
    );
}
// https://youtu.be/f0oy-NicIgE?si=FvwScpGgr76V1fcE
// console.log('https://youtu.be/f0oy-NicIgE?si=FvwScpGgr76V1fcE'.match(/\/.+\?/ig));
// https://www.youtube-nocookie.com/embed/[id]?modestbranding=1&;showinfo=0&;autohide=1&;rel=0;"
export default Posts;