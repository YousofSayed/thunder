import { useEffect, useRef, useState } from 'react';
import { getFromTo } from '../js/global';
import CreatePost from '../Components/CreatePost';
import Post from '../Components/Post';
import { $, $a, nFormatter, parse, uniqueID } from '../js/cocktail';
import { postSocket } from '../js/initSockets';
import Loader from '../Components/Shared/Loader';
import Repost from '../Components/Repost';
import NoDataHere from '../Components/Shared/NoDataHere';

function PostsView() {
    const [states, setStates] = useState({
        posts: [],
        showLoader: true
    });

    const postSectionRef = useRef();
    useEffect(() => {
        postSectionRef.current.scrollTop = +sessionStorage.getItem('postSectionScroll');
        getPosts(1, 500)
    }, []);

    useEffect(() => {
        postSocket.on('msg', getSocketData);
    });

    const getSocketData = (post) => {
        setStates({ ...states, posts: [...states.posts , post] });
        postSocket.removeListener('msg', getSocketData)
    };



    const getPosts = async (from, to) => {
        try {
            const postsData = await getFromTo('Posts', from, to);
            postsData[0] ? setStates({
                posts: [...states.posts, ...postsData.reverse()],
                showLoader: false
            }) :
                setStates({ ...states, showLoader: false })
        } catch (error) {
            throw new Error(error.message);
        }
    };




    return (
        <>
            <section ref={postSectionRef} className='container mt-[45px] mb-[40px]   relative md:dark:border-l md:dark:border-r md:dark:border-gray-700 flex flex-col items-center gap-3 bg-[#eee] dark:bg-transparent  p-2 ' >

                <CreatePost />

                {
                    states.posts[0]
                    &&
                    states.posts.map((postData, i) => {
                        if (postData.type == 'post')
                            return ( <section className='w-full' key={postData.schema._id}><Post post={postData.schema} className={`border-b border-b-gray-700`} withReacts={true} postSectionRef={postSectionRef.current}  /></section>)
                        else
                            return <section className='w-full' key={postData.schema._id}><Repost repost={postData.schema} postSectionRef={postSectionRef.current} /></section>
                    })
                }

                {states.showLoader && <Loader />}
                {!states.showLoader && !states.posts[0] && <NoDataHere />}
            </section>
        </>
    );
}

export default PostsView;
