import { useEffect, useRef, useState } from 'react';
import { getFromTo } from '../js/global';
import CreatePost from '../Components/CreatePost';
import Post from '../Components/Post';
import { $, $a, nFormatter, parse, uniqueID } from '../js/cocktail';
import { postSocket } from '../js/initSockets';
import Loader from '../Components/Shared/Loader';
import Repost from '../Components/Repost';
import NoDataHere from '../Components/Shared/NoDataHere';
import tb from '../js/tb';


export const observer = new IntersectionObserver((entries) => {
    entries.forEach(async (entry) => {
        // console.log(entry);
        if (entry.isIntersecting) {
            const id = entry.target.id;
            const vid = $(`#${id} #media video`);
            const imgs = $a(`#${id} #media img`);
            if (vid) {
                if (vid.src) return;
                vid.src = await tb.getFileFromBot(vid.getAttribute('tbid'));
                vid.poster = '';
                vid.controls = true;
                vid.load();
            }

            if (imgs.length) {
                imgs.forEach(async img => {
                    img.src = await tb.getFileFromBot(img.getAttribute('tbid'))
                })
            }
            observer.unobserve(entry.target);
        }
    })
})

function PostsView() {
    const [states, setStates] = useState({
        posts: [],
        showLoader: true
    });

    const postSectionRef = useRef();
    useEffect(() => {
        getPosts(2, 100)
    }, []);

    useEffect(() => {
        postSectionRef.current.scrollTop = +sessionStorage.getItem('postSectionScroll');
        postSocket.on('msg', getSocketData);
    });

    const getSocketData = (post) => {
        setStates({ ...states, posts: [...states.posts, post] });
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
            <section ref={postSectionRef} className='container h-full relative  flex flex-col   items-center gap-3 bg-[#eee] dark:bg-gray-900 rounded-lg p-2 overflow-x-auto hide-scrollbar' >

                <header className="w-full items-center bg-[#fff] dark:bg-gray-950 p-2 rounded-lg flex ring-1">
                    <input type="search" className=" w-full bg-transparent  text-black dark:text-white font-bold outline-none" placeholder="Search" title="search input" />
                    <i className="fa-solid  fa-search text-1xl text-cyan-400 dark:text-white" title='search icon'></i>
                </header>

                <CreatePost />


                {
                    states.posts[0]
                    &&
                    states.posts.map((postData, i) => {
                        if (postData.type == 'post')
                            return <Post post={postData.schema} withReacts={true} postSectionRef={postSectionRef.current} key={i} observer={observer} />
                        else
                            return <Repost repost={postData.schema} postSectionRef={postSectionRef.current} key={i} observer={observer} />
                    })
                }

                {states.showLoader && <Loader />}
                {!states.showLoader && !states.posts[0] && <NoDataHere />}
            </section>
        </>
    );
}

export default PostsView;
