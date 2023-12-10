import { useEffect, useRef, useState } from 'react';
import { getFromTo } from '../js/global';
import CreatePost from '../Components/CreatePost';
import Post from '../Components/Post';
import { $, nFormatter, parse } from '../js/cocktail';
import { postSocket } from '../js/initSockets';
import Loader from '../Components/Shared/Loader';


function PostsView() {
    const [posts, setPosts] = useState([]);
    const postSectionRef = useRef();
    useEffect(() => {
        getPosts(2, 100)
    }, []);

    useEffect(() => {
        if (postSectionRef.current) {
            const scrollTopVal = sessionStorage.getItem('postSectionScroll')
            postSectionRef.current.scrollTop = scrollTopVal ? +scrollTopVal : 0;
        }
        postSocket.on('updateReact', updateReact);
        postSocket.on('updateDoubleReact', updateDoubleReact)
    });

    const getPosts = async (from, to) => {
        try {
            const postsData = await getFromTo('Posts', from, to) || []
            setPosts([...posts, ...postsData].reverse())
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const handleScroll = (ev) => {
        sessionStorage.setItem('postSectionScroll', ev.target.scrollTop)
    }

    const updateReact = ({ elementRoot, num }) => {
        $(elementRoot).textContent = nFormatter(num);
    }

    const updateDoubleReact = ({ reactedElementRoot, tergtedElementRoot, newReactedVal, newTargtedVal }) => {
        $(reactedElementRoot).textContent = nFormatter(newReactedVal);
        $(tergtedElementRoot).textContent = nFormatter(newTargtedVal);
    }

    const getPostFromSocket = (post) => {

        postSocket.removeListener('updateReact', updateReact)
        postSocket.removeListener('updateDoubleReact', updateDoubleReact);
    }


    return (
        <>
            <section ref={postSectionRef} className='h-full relative container bg-gray-900 rounded-lg shadow-xl p-2 overflow-auto hide-scrollbar' onScroll={handleScroll}>

                <header className="w-full items-center gap-2 bg-gray-950 p-2 rounded-lg flex ring-1">
                    <input type="search" className=" w-full bg-transparent font-bold outline-none" placeholder="Search" title="search input" />
                    <i className="fa-solid  fa-search text-1xl text-white" title='search icon'></i>
                </header>

                <CreatePost />

                {
                    posts[0] ?
                    
                    posts.map((postData, i) => {
                        if (postData.type != 'post') return;
                        return (
                            <Post post={postData.schema} withReacts={true} key={i} />
                        )
                    })
                    :
                    <Loader/>
                }
            </section>
        </>
    );
}

export default PostsView;
