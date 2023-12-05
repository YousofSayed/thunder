import { useEffect, useState } from "react";
import { $a, $, parse, getLocalDate, stringify, PUT, DELETE, CocktailDB, nFormatter } from "../js/cocktail";
import tb from "../js/tb";
import initAndCreateColIndexedDb from "../js/initIndexedDB";
import styles from "../js/styles";
import { showMarquee } from "../js/global";
import { postSocket } from "../js/initSockets";

window.addEventListener('click', (e) => {
  const { target } = e;
  if (target.id == 'popup' || target.parentNode.id == 'popup' || target.parentNode.parentNode.id == 'popup' || target.id == 'popupHandler') {
    return
  } else {
    $a('#popup').forEach((popup) => !popup.classList.contains('hidden') ? popup.classList.add('hidden') : null);
  }
})


function Post({ data, posts, setPosts }) {
  const [showPostEditBtn, setShowPostEditBtn] = useState(false);
  const [isEditContent, setIsEditContent] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [react, setReact] = useState('')
  const [showPopup, setShowPopup] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);

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
    retweets,
    reacts,
  } = data;
  const user = parse(localStorage.getItem("user"));

  useEffect(() => {
    (async () => {
      await getImagesAndVideos();
      await checkIsSavedPost();
      await checkIsReported()
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

  const checkIsSavedPost = async () => {
    //Firstly i open the db by CocktailDB and createCollection (if collection has been not found)
    const db = new CocktailDB(user.email);
    const bookmarksColl = db.openCollection('Bookmarks');
    const post = await (await bookmarksColl).findOne({ _id });
    post ? setIsBookmark(true) : setIsBookmark(false);
  };

  const checkIsReported = async () => {
    const db = new CocktailDB(user.email);
    const reportedColl = await db.openCollection('Reports');
    const report = await ((await reportedColl).findOne({ _id }));
    report ? setIsReport(true) : setIsReport(false);
  }

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

    const reactIcon = $(`#post-${_id} #${nameOfReact}R-${_id}`);
    const reactNum = $(`#post-${_id} #${nameOfReact}N-${_id}`);

    if (react && react != nameOfReact) {
      const reactedIcon = $(`#post-${_id} #${react}R-${_id}`);
      const reactedNum = $(`#post-${_id} #${react}N-${_id}`);

      const decAndIncRes = await (await PUT({
        url: `http://localhost:9090/updateReact/${_id}`,
        queries: {
          decrement: react,
          increment: nameOfReact
        },
        json: true
      }))

      if (decAndIncRes.ok) {
        reactedIcon.classList.remove("fa-solid", "text-cyan-400");
        +reactedNum.textContent && +reactedNum.textContent > 0 ? +reactedNum.textContent-- : null;

        reactIcon.classList.add("fa-solid", "text-cyan-400");
        +reactNum.textContent ? +reactNum.textContent++ : null;

        setReact(nameOfReact)
        postSocket.emit('updateReact', { root: `#post-${_id} #${react}N-${_id}`, num: decAndIncRes.post.reacts[react] })
        postSocket.emit('updateReact', { root: `#post-${_id} #${nameOfReact}N-${_id}`, num: decAndIncRes.post.reacts[nameOfReact] })

      }
      else {
        console.error(decAndIncRes.msg);
      }
    }
    else if (react && react == nameOfReact) {
      const decRest = await (await PUT({
        url: `http://localhost:9090/updateReact/${_id}`,
        queries: {
          decrement: nameOfReact,
        },
        json: true
      }))

      if (decRest.ok) {
        reactIcon.classList.remove("fa-solid", "text-cyan-400");
        +reactNum.textContent && +reactNum.textContent > 0 ? +reactNum.textContent-- : null;
        setReact('');
        postSocket.emit('updateReact', { root: `#post-${_id} #${nameOfReact}N-${_id}`, num: decRest.post.reacts[nameOfReact] })
        console.log(decRest, 'lolo');

      }
    }
    else if (!react) {
      const incRes = await await PUT({
        url: `http://localhost:9090/updateReact/${_id}`,
        queries: {
          increment: nameOfReact,
        },
        json: true,
      });

      if (incRes.ok) {
        reactIcon.classList.add("fa-solid", "text-cyan-400");
        +reactNum.textContent ? +reactNum.textContent++ : null;
        postSocket.emit('updateReact', { root: `#post-${_id} #${nameOfReact}N-${_id}`, num: incRes.post.reacts[nameOfReact] })
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

    const db = new CocktailDB(user.email);
    const reportedColl = db.openCollection('Reports');

    if (isReport) {
      await (await reportedColl).deleteOne({ _id });
      setIsReport(false);
      return;
    }

    const res = await (await PUT({
      url: `http://localhost:9090/updateNumFileds/${_id}`,
      queries: {
        increment: 'reports'
      },
      json: true
    }));

    if (res.ok) {
      await (await reportedColl).set(data)
      setIsReport(true);
    }
    else {
      console.error(res.msg);
    }

    btn.disabled = false;
    showMarquee(false);
  };

  const savePost = async (ev) => {
    showMarquee(true);
    setShowPopup(false);
    const db = new CocktailDB(user.email);
    const bookmarks = db.openCollection('Bookmarks');

    const isSaved = await ((await bookmarks).findOne({ _id }));

    if (isSaved) {
      await ((await bookmarks).deleteOne({ _id }))
      setIsBookmark(false);
    }
    else {
      const bookmark = await (await bookmarks).set(data);
      setIsBookmark(true);
    }

    showMarquee(false);
  }

  const retweet = async (ev) => {
    const db = new CocktailDB(user.email);
    const retweetsColl = db.openCollection('Retweets');
    const retweet = await (await retweetsColl).findOne({ _id });


  }

  return (
    <section id={`post-${_id}`} className={`p-2 my-3 bg-gray-950 rounded-lg rtl ring-1`}>
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
            <li
              className="flex items-center gap-3 font-bold py-1 cursor-pointer bg-gray-950 p-2 rounded-lg"
              onClick={savePost}
            >
              <i className="fa-solid fa-bookmark text-lg "></i>
              {isBookmark ? 'Unsave' : 'Save'}
            </li>
            {
              user.id != userID
              &&
              (
                <li
                  className="flex items-center gap-3 font-bold py-1 cursor-pointer bg-gray-950 p-2 rounded-lg"
                  onClick={makeReport}
                >
                  <i className="fa-solid fa-flag text-lg "></i>
                  {isReport ? 'Unreport' : 'Report'}
                </li>
              )
            }
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
        onInput={(e) => { setEditValue(e.target.textContent); }}
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

      <ul className="mt-2  flex items-center justify-between gap-2  rounded-lg w-full">
        <section className="w-[100%] p-2 bg-gray-900 flex items-center justify-between  rounded-lg">

          <button onClick={(ev) => { doReact(ev, _id, `love`); }} className="w-fit">
            <i id={`loveR-${_id}`} className={`fa-regular  fa-heart cursor-pointer text-xl hover:text-cyan-400 transition-all`}></i>
            <span id={`loveN-${_id}`} className="ml-1 text-cyan-400">
              {nFormatter(reacts.love)}
            </span>
          </button>

          <button onClick={(ev) => { doReact(ev, _id, `haha`); }}>
            <i id={`hahaR-${_id}`} className="fa-regular fa-face-grin-tears cursor-pointer text-xl hover:text-cyan-400 transition-all"></i>{" "}
            <span id={`hahaN-${_id}`} className="ml-1 text-cyan-400">
              {nFormatter(reacts.haha)}
            </span>
          </button>

          <button onClick={(ev) => { doReact(ev, _id, `sad`); }}>
            <i id={`sadR-${_id}`} className="fa-regular fa-face-sad-tear cursor-pointer text-xl hover:text-cyan-400 transition-all"></i>
            <span id={`sadN-${_id}`} className="ml-1 text-cyan-400">
              {nFormatter(reacts.sad)}
            </span>
          </button>

          <button onClick={(ev) => { doReact(ev, _id, `angry`); }}>
            <i id={`angryR-${_id}`} className={`fa-regular fa-face-angry cursor-pointer text-xl hover:text-cyan-400 transition-all`}></i>
            <span id={`angryN-${_id}`} className="ml-1 text-cyan-400">
              {nFormatter(reacts.angry)}
            </span>
          </button>
        </section>

        <section className="w-fit p-2 bg-gray-900 flex items-center justify-between  rounded-lg">
          <button className="flex items-center gap-2">
            <i className="fa-solid fa-retweet cursor-pointer text-xl hover:text-cyan-400 transition-all"></i>{" "}
            <span className="ml-1">{nFormatter(retweets)}</span>
          </button>
        </section>
      </ul>
    </section>
  );
}

export default Post;
