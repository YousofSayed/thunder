import { useEffect, useRef, useState } from "react";
import Post from "../Components/Post";
import Repost from "../Components/Repost";
import { CocktailDB, parse } from "../js/cocktail";
import NoDataHere from "../Components/Shared/NoDataHere";

function Bookmarks() {
    const [posts, setPosts] = useState([]);
    const postSectionRef = useRef();
    const user = parse(localStorage.getItem('user'));

    useEffect(() => {
        getPostsFromIDB();
    })

    const getPostsFromIDB = async () => {
        const db = new CocktailDB(user.email);
        const IDBPosts = await (await db.openCollection('Bookmarks')).find();
        setPosts(IDBPosts);
    }

    return (
        <section ref={postSectionRef} className="container h-full relative  flex flex-col   items-center gap-3 bg-[#eee] dark:bg-gray-900 rounded-lg p-2 overflow-x-auto hide-scrollbar">
            {
                posts[0]
                &&
                posts.map(post => {
                    if (post.type == 'post')
                        return (<section className='w-full' key={post._id}><Post post={post.schema} withReacts={true} postSectionRef={postSectionRef.current} /></section>)
                    else
                        return <section className='w-full' key={post._id}><Repost repost={post.schema} postSectionRef={postSectionRef.current} /></section>
                })
            }

            {!posts.length && <NoDataHere />}
        </section>
    );
}

export default Bookmarks;