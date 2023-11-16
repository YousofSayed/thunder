import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { $, parse, stringify } from '../js/cocktail';
import Anonymous from './Anonymous';
import { useEffect, useState } from 'react';
import { filterData, getData, tb } from '../js/db';

function Posts() {
    const [user, setUser] = useState(parse(localStorage.getItem('user')));
    const [allpostsData, setAllPostsData] = useState([]);
    const [currentPostsData, setCurrentPostsData] = useState([]);
    const [morePosts, setMorePosts] = useState(false);
    const [imagesMedia, setImagesMedia] = useState([]);
    const [imageIds, setImagesID] = useState([]);

    useEffect(() => {
        (async () => {
            await checkUser();
            await getPosts({ from: 0, to: 25 })
        })();
    }, [])

    //Methods
    const checkUser = async () => {
        try {
            if (!user || !user.email || !user.name) { setUser(null); return };
            const isUser = await filterData({
                dbName: 'Users',
                value: user.email,
                boolean: true
            });
            console.log(isUser);

            if (isUser.ok) {
                delete isUser.data[0].password
                localStorage.setItem('user', stringify(isUser.data[0]));
                setUser(isUser.data);
            } else {
                localStorage.removeItem('user');
                setUser(null);
            }
        } catch (error) {
            throw new Error(error.message);
        }

    }

    const getPosts = async ({ from, to }) => {
        const res = await filterData({
            dbName: 'Posts',
            value: '$_All'
        });
        console.log(res);
        setAllPostsData(res);
        setCurrentPostsData(res.slice(0, 50));
        const currentData = res.slice(from, to);
        console.log(currentData[0]);
        currentData[0] ? setMorePosts(true) : setMorePosts(false)
    }

    const uploadImages = async (e) => {
        const { files } = e.target;
        if (files.length > 4) { alert(`Max image number is 4`); return }
        const urls = [];
        for (const file of files) {
            urls.push({ blobURL: URL.createObjectURL(file), file })
        }
        setImagesMedia(urls);
    }


    const deleteImg = (item) => {
        const newImagesMedia = imagesMedia.filter(e => e.blobURL != item.blobURL);
        setImagesMedia(newImagesMedia);
    }

    const postThePost = async () => {

    }
    return (
        <>
            <section className='h-full w-[calc(50%)] bg-gray-900 rounded-lg shadow-xl p-2 overflow-auto'>
                <header className='p-2 w-full bg-gray-950 rounded-lg flex'>
                    <p className='w-[50%] p-2 cursor-pointer font-bold bg-gray-900 rounded-lg text-cyan-400 text-center '>For You</p>
                    <p className='w-[50%] p-2 cursor-pointer font-bold text-center '>Following</p>
                </header>

                <article className='flex flex-col bg-gray-950 mt-2 h-fit rounded-lg p-2'>
                    <header className='flex items-center justify-between'>
                        <h1 className='font-bold py-2 text-cyan-400'>Post Something :</h1>
                        <div className='w-[25px] h-[25px] border-4 rounded-full border-cyan-400 border-l-transparent animate-spin hidden'></div>
                    </header>

                    <section className='over overflow-y-auto  max-h-[400px] h-fit mt-3'>
                        <textarea
                            className='break-words w-full outline-none font-medium bg-gray-900 p-2 rounded-lg resize-none transition-all'
                            placeholder='What is in your mind?'
                            onFocus={(e) => { e.target.classList.add('h-[300px]') }}
                            onBlur={(e) => { e.target.classList.remove('h-[300px]') }}
                        ></textarea>
                    </section>

                    {imagesMedia[0] && <section className='w-full p-4 flex  flex-wrap justify-between gap-2 items-center bg-gray-900 mt-3 rounded' id='media'>
                        {imagesMedia.map((srcs, i) => {
                            return (
                                <figure className=' w-[100px] h-[100px] flex justify-center items-center  rounded-lg relative' key={i}>
                                    <img src={srcs.blobURL} />
                                    <i
                                        className='fa-solid fa-x w-[25px] h-[25px] rounded-full cursor-pointer text-cyan-300 bg-gray-950 text-[14px] flex justify-center items-center absolute right-[-10px] top-[-10px]'
                                        onClick={() => { deleteImg(srcs) }}
                                    ></i>
                                </figure>
                            )
                        })}
                    </section>}

                    <section className='p-2 w-full  mt-3 flex justify-between'>
                        <ul className='flex itemes-center gap-4'>
                            <i className="fa-regular fa-image cursor-pointer transition-all text-cyan-400 text-lg" onClick={() => { $('#fImages').click() }}><input type="file" className='hidden' id='fImages' accept='image/*' onChange={uploadImages} multiple={true} /></i>
                            <i className="fa-solid fa-film cursor-pointer transition-all text-cyan-400 text-lg" onClick={() => { $('#fVideos').click() }}><input type="file" className='hidden' id='fVideos' accept='video/*' /></i>
                        </ul>
                        <button className='px-2 py-1 bg-cyan-600 rounded-md font-bold '>POST</button>
                    </section>
                </article>
            </section>
        </>
    );
}

export default Posts;