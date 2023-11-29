import { useEffect, useState } from 'react';
import { getFromTo } from '../js/global';
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
                    posts.length
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
