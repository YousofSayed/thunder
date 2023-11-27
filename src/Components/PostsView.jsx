import { $, copyToClipboard, get, parse, parseToHTML, stringify } from '../js/cocktail';
import { useEffect, useState } from 'react';
import { append, getFromTo, showMarquee } from '../js/global';
import tb from '../js/tb';
import CreatePost from './CreatePost';
import Post from './Post';


function PostsView() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getPosts(2, 10)
    }, []);

    const getPosts = async (from, to) => {
        const postsData = await getFromTo('Posts', from, to) || []
        setPosts([...posts, ...postsData])
    }

    
    return (
        <>
            <section className='h-full relative container bg-gray-900 rounded-lg shadow-xl p-2 overflow-auto scrollBar'>

                <header className="w-full items-center gap-2 bg-gray-950 p-2 rounded-lg flex ring-1">
                    <input type="search" className=" w-full bg-transparent font-bold outline-none" placeholder="Search" title="search input" />
                    <i className="fa-solid  fa-search text-1xl text-white" title='search icon'></i>
                </header>

                <CreatePost />

                {
                    posts[0]
                    &&
                    posts.map((postData, i) => {
                        return (
                            <Post data={postData[0]} key={i} />
                        )
                    })
                }
            </section>
        </>
    );
}

export default PostsView;
