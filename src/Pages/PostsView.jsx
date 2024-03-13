import { useContext, useEffect, useRef, useState } from "react";
import { getFromTo } from "../js/global";
import CreatePost from "../Components/CreatePost";
import Post from "../Components/Post";
import { postSocket } from "../js/initSockets";
import Loader from "../Components/Shared/Loader";
import Repost from "../Components/Repost";
import NoDataHere from "../Components/Shared/NoDataHere";
import { Container } from "../Components/Shared/Container";
import { storeCtx } from "../js/store";

function PostsView() {
  const [states, setStates] = useState({
    showLoader: true,
  });
  const postSectionRef = useRef();
  const { state, dispatch } = useContext(storeCtx);

  useEffect(() => {
    postSectionRef.current.scrollTop =
      +sessionStorage.getItem("postSectionScroll");
    getPosts(1, 100);
  }, []);

  useEffect(() => {
    postSocket.on("msg", getSocketData);
  });

  const getSocketData = (post) => {
    dispatch({ type: "put", key: "posts", value: [...state.posts,post ] });
    postSocket.removeListener("msg", getSocketData);
  };

  const getPosts = async (from, to) => {
    try {
      if (state.posts.length) {
        setStates({ ...states, showLoader: false });
        return;
      }
      const postsData = await getFromTo("Posts", from, to);
      setStates({ ...states, showLoader: false });
      dispatch({
        type: "put",
        key: "posts",
        value: [...state.posts, ...postsData.reverse()],
      });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <>
      <Container innerRef={postSectionRef}>
        <CreatePost />

        {state.posts[0] &&
          state.posts.map((postData, i) => {
            if (postData.type == "post")
              return (
                <section
                  className="w-full"
                  key={i}
                  animate={i % 2 == 0 ? "fade-in-right" : "fade-in-left"}
                >
                  <Post
                    post={postData.schema}
                    className={`border-b border-b-gray-700`}
                    withReacts={true}
                  />
                </section>
              );
            else
              return (
                <section
                  className="w-full"
                  key={i}
                  animate={i % 2 == 0 ? "fade-in-right" : "fade-in-left"}
                >
                  <Repost repost={postData.schema} />
                </section>
              );
          })}

        {states.showLoader && <Loader />}
        {!states.showLoader && !state.posts[0] && <NoDataHere />}
      </Container>
    </>
  );
}

export default PostsView;
