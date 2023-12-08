import { useEffect, useState } from 'react';
import { getFromTo } from '../js/global';
import CreatePost from './CreatePost';
import Post from './Post';
import { $, nFormatter, parse } from '../js/cocktail';
import { postSocket } from '../js/initSockets';


function PostsView() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getPosts(2, 100)
    }, []);

    useEffect(()=>{
        postSocket.on('updateReact',updateReact);
        postSocket.on('updateDoubleReact',updateDoubleReact)
    });

    const getPosts = async (from, to) => {
        try {
            const postsData = await getFromTo('Posts', from, to) || []
            console.log(postsData);
            setPosts([...posts, ...postsData].reverse())
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const updateReact = ({elementRoot , num})=>{
        $(elementRoot).textContent = nFormatter(num);
    }

    const updateDoubleReact = ({reactedElementRoot , tergtedElementRoot ,newReactedVal,newTargtedVal})=>{
        $(reactedElementRoot).textContent = nFormatter(newReactedVal);
        $(tergtedElementRoot).textContent = nFormatter(newTargtedVal);
    }

    const getPostFromSocket = (post)=>{

        postSocket.removeListener('updateReact',updateReact)
        postSocket.removeListener('updateDoubleReact',updateDoubleReact);
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
                        if(postData.type != 'post')return;
                        return (
                            <Post post={postData.schema} key={i} />
                        )
                    })
                }
            </section>
        </>
    );
}

export default PostsView;
