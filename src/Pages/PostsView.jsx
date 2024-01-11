import { useContext, useEffect, useRef, useState } from 'react';
import { getFromTo } from '../js/global';
import CreatePost from '../Components/CreatePost';
import Post from '../Components/Post';
import { postSocket } from '../js/initSockets';
import Loader from '../Components/Shared/Loader';
import Repost from '../Components/Repost';
import NoDataHere from '../Components/Shared/NoDataHere';
import { Container } from '../Components/Shared/Container';
import { storeCtx } from '../js/store';

function PostsView() {
    const [states, setStates] = useState({
        showLoader: true
    });

    const { state, dispatch } = useContext(storeCtx)

    const postSectionRef = useRef();
    useEffect(() => {
        postSectionRef.current.scrollTop = +sessionStorage.getItem('postSectionScroll');
        getPosts(1, 500)
    }, []);

    useEffect(() => {
        postSocket.on('msg', getSocketData);
    });

    const getSocketData = (post) => {
        dispatch({ type: 'put', key: 'posts', value: [...states.posts, post] })
        postSocket.removeListener('msg', getSocketData)
    };



    const getPosts = async (from, to) => {
        try {
            if (state.posts.length) return;
            const postsData = await getFromTo('Posts', from, to);
            if (postsData.length) {
                setStates({showLoader: false});
                dispatch({ type: 'put', key: 'posts', value: [...state.posts, ...postsData.reverse()] })
            }
            else {

                setStates({ ...states, showLoader: false })
            }
        } catch (error) {
            throw new Error(error.message);
        }
    };




    return (
        <>
            <Container innerRef={postSectionRef}>
                <CreatePost />

                {
                    state.posts[0]
                    &&
                    state.posts.map((postData, i) => {
                        if (postData.type == 'post')
                            return (<section className='w-full' key={postData.schema._id}><Post post={postData.schema} className={`border-b border-b-gray-700`} withReacts={true} postSectionRef={postSectionRef.current} /></section>)
                        else
                            return <section className='w-full' key={postData.schema._id}><Repost repost={postData.schema} postSectionRef={postSectionRef.current} /></section>
                    })
                }

                {states.showLoader && <Loader />}
                {!states.showLoader && !state.posts[0] && <NoDataHere />}
            </Container>
        </>
    );
}

export default PostsView;
