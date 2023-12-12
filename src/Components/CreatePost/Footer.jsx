import { useContext, useRef } from "react";
import postSchema from "../../Schemas/postSchema";
import { CreatePostContext } from "../CreatePost";
import { append, showMarquee } from "../../js/global";
import tb from "../../js/tb";
import { addClickClass, stringify } from "../../js/cocktail";
import { postSocket } from "../../js/initSockets";

function CreatePostFooter() {
    const imagesInputRef = useRef();
    const vidInputRef = useRef();
    const { context, setContext } = useContext(CreatePostContext);
    const {
        postContent,
        imagesMedia,
        video,
        iframeSrc,
        charLength,
        textAreaRef,
        iframeInputRef,
        showIframeSection,
        user
    } = context;

    const postThePost = async (ev) => {
        const btn = ev.currentTarget;
        btn.disabled = true;
        addClickClass(btn, 'click');
        console.log(btn, textAreaRef);
        try {
            if (!postContent) {
                alert(`Enter content to post`);
                return;
            }
            showMarquee(true);
            const images = [], vid = [];

            if (imagesMedia[0]) {

                for (const item of imagesMedia) {
                    const res = await (await tb.sendImage(item.file)).id
                    images.push(res)
                }
            }

            if (video[0]) {
                for (const item of video) {
                    vid.push(await (await tb.sendVideo(item.file)).id)
                }
            }

            const postData = {
                type: 'post',
                schema: postSchema({ user, postContent, images, vid, iframeSrc })
            };

            const res = await append('Posts', postData);
            textAreaRef.value = '';
            iframeInputRef ? iframeInputRef.value = '' : null;
            setContext({
                ...context,
                postContent: '',
                charLength: 0,
                imagesMedia: [],
                video: [],
                iframeSrc: [],
            });
            postSocket.emit('msg',postData);
            showMarquee(false);
            btn.disabled = false;
        }
        catch (error) {
            setTimeout(async () => await postThePost(), 1000)
            throw new Error(error.message);
        }
        finally {
            btn.disabled = false;
        }
    };

    const uploadImages = async (e) => {
        const { files } = e.target;
        textAreaRef.classList.remove('min-h-[300px]')
        if (files.length > 4) { alert(`Max image number is 4`); return }
        const urls = [];
        for (const file of files) {
            urls.push({ blobURL: URL.createObjectURL(file), file })
        }
        setContext({ ...context, imagesMedia: urls })
    };

    const uploadVideo = async (e) => {
        const file = e.target.files[0];
        if ((file.size / 1000000) >= 50) { alert(`Maximum size is 50MB`); return }
        textAreaRef.classList.remove('min-h-[300px]')
        setContext({ ...context, video: [{ blobURL: URL.createObjectURL(file), file }] })
    };

    const showAndHideIframeSection = () => {
        showIframeSection ? setContext({ ...context, showIframeSection: false }) : setContext({ ...context, showIframeSection: true });
    }

    return (
        <>
            <footer className='p-2 w-full  mt-3 flex justify-between'>
                <ul className='flex items-center h-full gap-4'>
                    <i className="fa-regular fa-image cursor-pointer transition-all text-cyan-400 text-lg" onClick={() => { imagesInputRef.current.click() }}><input type="file" className='hidden' ref={imagesInputRef} accept='image/*' onChange={uploadImages} multiple={true} /></i>
                    <i className="fa-solid fa-film cursor-pointer transition-all text-cyan-400 text-lg" onClick={() => { vidInputRef.current.click() }}><input type="file" className='hidden' ref={vidInputRef} accept='video/*' onChange={uploadVideo} /></i>
                    <i className='fa-solid fa-link cursor-pointer transition-all text-cyan-400 text-lg' onClick={showAndHideIframeSection}></i>
                    <span className='p-2 bg-cyan-500 font-bold rounded-lg '>{charLength}/5000</span>
                </ul>
                <button className='px-2 py-1 bg-cyan-600 rounded-md font-bold' onClick={postThePost}>POST</button>
            </footer>
        </>
    );
}

export default CreatePostFooter;