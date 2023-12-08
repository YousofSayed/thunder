import { useEffect, useState } from 'react';
import CreatePost from './CreatePost';
import Post from './Post';
<<<<<<< HEAD
import { $, nFormatter, parse } from '../js/cocktail';
import { postSocket } from '../js/initSockets';

=======
import { $, GET, nFormatter} from '../js/cocktail';
import { postSocket } from '../js/initSockets';
>>>>>>> e104798848a728abe257f6741a48f6679d6cac5e

function PostsView() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        (async () => {
            await getPosts(0, 10);
        })()
    }, []);

<<<<<<< HEAD
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
=======
    useEffect(() => {
        //With every update (add post) for component i set event listener and remove it with end of proccess
        postSocket.on('post', getSocketPost);
        postSocket.on('updateReact', getUpdate);
    });


    const getSocketPost = (post) => {
        setPosts(posts.concat(post));
        postSocket.removeListener('post', getSocketPost);
    }

    const getUpdate = ({ root, num }) => {
        $(root).textContent = nFormatter(num);
        postSocket.removeListener('updateReact', getUpdate);
    }

    const getPosts = async (from, to) => {
        try {
            const postsData = await (await GET({
                url: `http://localhost:9090/getFromToPosts/${from}/${to}`,
                json: true,
            })).posts

            setPosts([...posts, ...postsData]);
        } catch (error) {
            throw new Error(error.message);
        }
>>>>>>> e104798848a728abe257f6741a48f6679d6cac5e
    }


    return (
        <>
            <section className='h-full relative container bg-gray-900 rounded-lg shadow-xl p-2 overflow-auto scrollBar'>

                <header className="w-full p-2  bg-gray-950  rounded-lg flex items-center ring-1">
                    <input type="search" className=" w-full bg-transparent font-bold outline-none" placeholder="Search" title="search input" />
                    <i className="fa-solid  fa-search text-1xl text-white" title='search icon'></i>
                </header>

                <CreatePost />

                {
                    posts[0]
                    &&
                    posts.map((postData, i) => {
                        postData = parse(postData);
                        if(postData.type != 'post')return;
                        return (
<<<<<<< HEAD
                            <Post post={postData.schema} key={i} />
=======
                            <Post data={postData} posts={posts} setPosts={setPosts} key={i} />
>>>>>>> e104798848a728abe257f6741a48f6679d6cac5e
                        )
                    })
                }
            </section>
        </>
    );
}

export default PostsView;
