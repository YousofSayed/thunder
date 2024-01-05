import { useEffect, useRef, useState } from "react";
import SearchBar from '../Components/Shared/SearchBar'
import Loader from "../Components/Shared/Loader";
import NoDataHere from "../Components/Shared/NoDataHere";
import Post from "../Components/Post";
import Repost from "../Components/Repost";
import { Container } from "../Components/Shared/Container";

function Search() {
    const [searchCtx, setSearchCtx] = useState({
        posts: [],
        showLoader: false,
        isNoDataHere: false,
    });
    const postSectionRef = useRef();
    const postRef = useRef();

    return (
        <Container innerRef={postSectionRef}>
            <SearchBar searchCompCtx={[searchCtx, setSearchCtx]} />
            {
                searchCtx.posts[0]
                &&
                searchCtx.posts.map((postData, i) => {
                    if (postData.type == 'post')
                        return (<section className='w-full' key={postData.schema._id}><Post post={postData.schema} withReacts={true} postSectionRef={postSectionRef.current} /></section>)
                    else
                        return <section className='w-full' key={postData.schema._id}><Repost repost={postData.schema} postSectionRef={postSectionRef.current} /></section>
                })
            }
            {searchCtx.showLoader && <Loader />}
            {searchCtx.isNoDataHere && <NoDataHere />}

        </Container>
    );
}

export default Search;