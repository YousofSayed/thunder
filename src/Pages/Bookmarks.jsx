import { useEffect, useRef, useState } from "react";
import Post from "../Components/Post";
import Repost from "../Components/Repost";
import { CocktailDB, parse } from "../js/cocktail";
import NoDataHere from "../Components/Shared/NoDataHere";
import { Container } from "../Components/Shared/Container";

function Bookmarks() {
    const [posts, setPosts] = useState([]);
    const postSectionRef = useRef();
    const user = parse(localStorage.getItem('user'));

    useEffect(() => {
        getPostsFromIDB();
    }, [])

    const getPostsFromIDB = async () => {
        const db = new CocktailDB(user.email);
        const IDBPosts = await (await db.openCollection('Bookmarks')).find();
        setPosts(IDBPosts);
    }

    return (
        <Container innerRef={postSectionRef}>
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
        </Container>
    );
}

export default Bookmarks;