import { useEffect, useState } from 'react';
import CreatePost from './CreatePost';
import Post from './Post';
import { $, GET, nFormatter} from '../js/cocktail';
import { postSocket } from '../js/initSockets';

function PostsView() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        (async () => {
            await getPosts(0, 10);
        })()
    }, []);

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
                        return (
                            <Post data={postData} posts={posts} setPosts={setPosts} key={i} />
                        )
                    })
                }
            </section>
        </>
    );
}

export default PostsView;
