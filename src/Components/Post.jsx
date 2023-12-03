import { useEffect, useState } from "react";
import { $a, $, parse, getLocalDate, stringify, PUT, DELETE } from "../js/cocktail";
import tb from "../js/tb";
import initAndCreateColIndexedDb from "../js/initIndexedDB";
import styles from "../js/styles";
import { showMarquee } from "../js/global";

function Post({ data, posts, setPosts }) {
  const [showPostEditBtn, setShowPostEditBtn] = useState(false);
  const [isEditContent, setIsEditContent] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [react, setReact] = useState('')
  const [showPopup, setShowPopup] = useState(false);
  const [report, setReport] = useState(false);

  const {
    userName,
    profImgId,
    email,
    _id,
    userID,
    date,
    postContent,
    media,
    index,
    reacts,
  } = data;
  const user = parse(localStorage.getItem("user"));
  const reactedPostsCollection = initAndCreateColIndexedDb("reactedPosts");

  useEffect(() => {
    (async () => {
      await getImagesAndVideos();
    })();
  });

  const getImagesAndVideos = () => {
    $a(`#post-${_id} img`).forEach(
      async (img) => (img.src = await tb.getFileFromBot(img.id))
    );
    $a(`#post-${_id} video`).forEach(
      async (vid) => (vid.src = await tb.getFileFromBot(vid.id))
    );
  };

  const showMoreOrLess = (e) => {
    if (e.target.hasAttribute("open")) {
      e.target.removeAttribute("open");
      $(`#sumry-${index}`).classList.remove("hidden");
    } else {
      $(`#sumry-${index}`).classList.add("hidden");
    }
  };

  const doReact = async (ev, _id, nameOfReact) => {
    const btn = ev.currentTarget;
    btn.disabled = true;

    if (react) {
      const decAndIncRes = await (await PUT({
        url: `http://localhost:9090/updateReact/${_id}`,
        queries: {
          decrement: react,
          increment: nameOfReact
        },
        json: true
      }))

      if (decAndIncRes.ok) {
        $(`#post-${_id} #${react}R-${_id}`).classList.remove("fa-solid", "text-cyan-400");
        +$(`#post-${_id} #${react}N-${_id}`).textContent--;

        $(`#post-${_id} #${nameOfReact}R-${_id}`).classList.add("fa-solid", "text-cyan-400");
        +$(`#post-${_id} #${nameOfReact}N-${_id}`).textContent++;
      }
      else {
        console.error(decAndIncRes.msg);
      }
    }
    else {
      const incrementReactRes = await await PUT({
        url: `http://localhost:9090/updateReact/${_id}`,
        queries: {
          increment: nameOfReact,
        },
        json: true,
      });

      if (incrementReactRes.ok) {
        $(`#post-${_id} #${nameOfReact}R-${_id}`).classList.add("fa-solid", "text-cyan-400");
        +$(`#post-${_id} #${nameOfReact}N-${_id}`).textContent++;
        setReact(nameOfReact);
      }
      else {
        console.error(incrementReactRes.msg);
      }
    }

    btn.disabled = false;
  };

  const makeEditAble = () => {
    setIsEditContent(true);
    setShowPostEditBtn(true);
  };

  const postTheEdit = async (ev) => {
    ev.target.disabled = true;
    showMarquee(true);
    if (editValue == postContent) {
      setIsEditContent(false);
      setShowPostEditBtn(false);
    }
    else if (editValue.length >= 5000) {
      alert(`Maximum 5000 character`);
      return;
    }
    else {
      const res = await await PUT({
        url: `http://localhost:9090/updatePostContent/${_id}/postContent`,
        data: {
          value: editValue,
        },
      });

      if (res.ok) {
        setIsEditContent(false);
        setShowPostEditBtn(false);
      }
    }
    ev.target.disabled = false;
    showMarquee(false);
  };

  const deletePost = async (ev) => {
    const btn = ev.currentTarget;
    btn.disabled = true;
    showMarquee(true);
    setShowPopup(false);

    const res = await (await DELETE({
      url: `http://localhost:9090/deletePost/${_id}`,
      json: true
    }))
    if (res.ok) {
      const newPostsArr = posts.filter((post) => post._id != _id);
      setPosts([...newPostsArr]);
    }
    else {
      console.error(res.msg);
    }
    showMarquee(false);
    btn.disabled = false;
  };

  const makeReport = async (ev) => {
    const btn = ev.currentTarget;
    btn.disabled = true;
    showMarquee(true);
    setShowPopup(false);

    const res = await (await PUT({
      url: `http://localhost:9090/updateNumFileds/${_id}`,
      queries: {
        increment: 'reports'
      },
      json: true
    }));

    if (res.ok) {
      setReport(true)
    }
    else{
      console.error(res.msg);
    }

    btn.disabled = false;
    showMarquee(false);
  }

  return (
    <section
      id={`post-${_id}`}
      className={`p-2 my-3 bg-gray-950 rounded-lg rtl ring-1 ${report && `ring-red-600`}`}
    >
      <header className="relative flex justify-between items-center">
        <figure className="w-fit flex gap-2 rounded-lg items-center px-2 py-1  bg-gray-900 ">
          <img id={profImgId} className="w-9 h-9 rounded-full cursor-pointer" />
          <p className="font-bold">{userName}</p>
        </figure>

        <ul className="flex gap-4 items-center">
          {showPostEditBtn && <button className={styles.btn} onClick={postTheEdit}>POST</button>}
          <i
            id="popupHandler"
            className="fa-solid fa-ellipsis text-xl cursor-pointer"
            onClick={() => {
              showPopup ? setShowPopup(false) : setShowPopup(true);
            }}
          ></i>
        </ul>

        {
          showPopup
          &&
          <ul
            id="popup"
            className="flex flex-col z-10 gap-2 p-2 rounded-lg absolute right-[7px] top-[35px] bg-gray-900"
          >
            {user.id == userID && (
              <li
                className="flex items-center gap-3 font-bold py-1 cursor-pointer bg-gray-950 p-2 rounded-lg"
                onClick={makeEditAble}
              >
                <i className="fa-solid fa-pen-to-square text-lg "></i> Edit
              </li>
            )}
            <li className="flex items-center gap-3 font-bold py-1 cursor-pointer bg-gray-950 p-2 rounded-lg">
              <i className="fa-solid fa-bookmark text-lg "></i> Save
            </li>
            <li
              className="flex items-center gap-3 font-bold py-1 cursor-pointer bg-gray-950 p-2 rounded-lg"
              onClick={makeReport}
            >
              <i className="fa-solid fa-flag text-lg "></i> Report
            </li>
            {user.id == userID && (
              <li
                className="flex items-center gap-3 font-bold py-1 cursor-pointer bg-gray-950 p-2 rounded-lg"
                onClick={deletePost}
              >
                <i className="fa-solid fa-trash text-red-500 text-lg"></i> Delete
              </li>
            )}
          </ul>
        }

      </header>

      <article id="date" className="dark:text-gray-400 text-sm font-bold py-2">
        {date.split(",")[0] == getLocalDate()
          ? `Today , ${date.split(",")[1]}`
          : date}
      </article>

      <article
        id={`postContent-${_id}`}
        contentEditable={isEditContent}
        className={`my-2 pb-2 font-bold rounded-lg ${isEditContent && "bg-gray-900 p-2"
          }`}
        onInput={(e) => { setEditValue(e.target.textContent); console.log(true); }}
      >
        {postContent
          .match(/\w+(\W+)?|.+/gi)
          .slice(0, 50)
          .join(" ")}

        {postContent.match(/\w+(\W+)?|.+/gi).length > 50 && (
          <details onClick={showMoreOrLess}>
            <summary id={`sumry-${index}`} className="text-cyan-400">
              Showmore
            </summary>
            {postContent
              .match(/\w+(\W+)?|.+/gi)
              .slice(50)
              .join(" ")}
          </details>
        )}
      </article>

      {media.images[0] && (
        <section
          id="images"
          className={`bg-gray-900 p-2 rounded-sm flex items-center gap-2`}
        >
          {media.images.map((imgId, i) => {
            return (
              <figure
                className="w-full flex items-center justify-center"
                key={i}
              >
                <img id={imgId} className=" rounded-sm" loading="lazy" />
              </figure>
            );
          })}
        </section>
      )}

      {media.vid[0] && (
        <section
          id="video"
          className={`bg-gray-900 p-2 rounded-sm flex items-center gap-2`}
        >
          {media.vid.map((vidId, i) => {
            return (
              <figure
                className="w-full flex items-center justify-center"
                key={i}
              >
                <video id={vidId} className=" rounded-sm" controls />
              </figure>
            );
          })}
        </section>
      )}

      {media.iframeSrc[0] && (
        <section
          id="iframe"
          className={`bg-gray-900 p-2 rounded-sm flex items-center gap-2 my-2 `}
        >
          {media.iframeSrc.map((src, i) => {
            return (
              <figure
                className="w-full flex items-center justify-center"
                key={i}
              >
                <iframe
                  src={src + "&rel=0"}
                  className=" rounded-sm h-[300px] w-full"
                  loading="lazy"
                  allowFullScreen={true}
                ></iframe>
              </figure>
            );
          })}
        </section>
      )}

      <ul className="mt-2 p-2 flex items-center justify-between bg-gray-900 rounded-lg w-full">
        <button
          onClick={(ev) => {
            doReact(ev, _id, `love`);
          }}
          className="w-fit"
        >
          <i
            id={`loveR-${_id}`}
            className={`fa-regular  fa-heart cursor-pointer text-xl hover:text-cyan-400 transition-all`}
          ></i>{" "}
          <span id={`loveN-${_id}`} className="ml-1 text-cyan-400">
            {+reacts.love}
          </span>
        </button>
        <button
          onClick={(ev) => {
            doReact(ev, _id, `haha`);
          }}
        >
          <i
            id={`hahaR-${_id}`}
            className="fa-regular fa-face-grin-tears cursor-pointer text-xl hover:text-cyan-400 transition-all"
          ></i>{" "}
          <span id={`hahaN-${_id}`} className="ml-1 text-cyan-400">
            {+reacts.haha}
          </span>
        </button>
        <button
          onClick={(ev) => {
            doReact(ev, _id, `sad`);
          }}
        >
          <i
            id={`sadR-${_id}`}
            className="fa-regular fa-face-sad-tear cursor-pointer text-xl hover:text-cyan-400 transition-all"
          ></i>{" "}
          <span id={`sadN-${_id}`} className="ml-1 text-cyan-400">
            {+reacts.sad}
          </span>
        </button>
        <button
          onClick={(ev) => {
            doReact(ev, _id, `angry`);
          }}
        >
          <i
            id={`angryR-${_id}`}
            className={`fa-regular fa-face-angry cursor-pointer text-xl hover:text-cyan-400 transition-all`}
          ></i>{" "}
          <span id={`angryN-${_id}`} className="ml-1 text-cyan-400">
            {+reacts.angry}
          </span>
        </button>
        <li>
          <i className="fa-solid fa-retweet cursor-pointer text-xl hover:text-cyan-400 transition-all"></i>{" "}
          <span className="ml-1">{+reacts.angry}</span>
        </li>
      </ul>
    </section>
  );
}

export default Post;
