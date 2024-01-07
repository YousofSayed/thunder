import { useContext, useRef } from "react";
import postSchema from "../../Schemas/postSchema";
import { CreatePostContext } from "../CreatePost";
import { append, showMarquee, warn } from "../../js/global";
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


    const uploadImages = async (e) => {
        try {
            const { files } = e.target;
            addClickClass(e.target, 'click');
            textAreaRef.classList.remove('min-h-[300px]')
            if (files.length > 4) { alert(`Max image number is 4`); return }
            const urls = [];
            for (const file of files) {
                urls.push({ blobURL: URL.createObjectURL(file), file })
            }
            setContext({ ...context, imagesMedia: urls })
        } catch (error) {
            throw new Error(error.message)
        }
    };

    const uploadVideo = async (e) => {
        try {
            const file = e.target.files[0];
            addClickClass(e.target, 'click');
            if ((file.size / 1000000) >= 50) { alert(`Maximum size is 50MB`); return }
            textAreaRef.classList.remove('min-h-[300px]')
            setContext({ ...context, video: [{ blobURL: URL.createObjectURL(file), file }] })
        } catch (error) {
            throw new Error(error.message)
        }
    };

    const showAndHideIframeSection = (ev) => {
        addClickClass(ev.target,'click') ;
        showIframeSection ? setContext({ ...context, showIframeSection: false }) : setContext({ ...context, showIframeSection: true });
    };

    const postThePost = async (ev) => {
        const btn = ev.currentTarget;
        btn.disabled = true;
        addClickClass(btn, 'click');
        try {
            if (!postContent) {
                alert(`Enter content to post`);
                return;
            }
            showMarquee(true);
            const postData = {
                type: 'post',
                schema: postSchema({ user, postContent, iframeSrc })
            };

            if (imagesMedia[0]) {
                for (const item of imagesMedia) {
                    const res = await (await tb.sendImage(item.file));
                    res.ok && (postData.schema.media.images = [{ url: res.url, id: res.id }]);
                }
            }

            if (video[0]) {
                for (const item of video) {
                    const res = await tb.sendVideo(item.file);
                    res.ok && (postData.schema.media.vid = [{ url: res.url, id: res.id }]);
                }
            };

            if (video.length && !postData.schema.media.vid.length || imagesMedia.length && !postData.schema.media.images.length) {
                console.warn(`Error while uploading media...`);
                setTimeout(async () => await postThePost(ev), 100)
                return;
            }

            const res = await append('Posts', postData);
            const index = res.updates.updatedRange?.match(/\d+/ig)[0];
            postData.schema.index = index;
            console.log(postData);
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
            postSocket.emit('msg', postData);
            showMarquee(false);
            btn.disabled = false;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            btn.disabled = false;
        }
    };

    return (
        <>
            <footer className='p-2 w-full  mt-3 flex justify-between'>
                <ul className='flex items-center h-full gap-4'>
                    <i className="fa-regular fa-image cursor-pointer transition-all text-black dark:text-white text-lg" onClick={(ev) => {addClickClass(ev.target,'click') ;imagesInputRef.current.click() }}><input type="file" className='hidden' ref={imagesInputRef} accept='.png,.jpg,.jpeg' onChange={uploadImages} multiple={true} /></i>
                    <i className="fa-solid fa-film cursor-pointer transition-all text-black dark:text-white text-lg" onClick={(ev) => { addClickClass(ev.target,'click') ;vidInputRef.current.click() }}><input type="file" className='hidden' ref={vidInputRef} accept='.mp4, .mp3' onChange={uploadVideo} /></i>
                    <i className='fa-solid fa-link cursor-pointer transition-all text-black dark:text-white text-lg' onClick={showAndHideIframeSection}></i>
                    <span className='p-2 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg '>{charLength}/5000</span>
                </ul>
                <button className='px-2 py-1 bg-black text-white dark:bg-white dark:text-black rounded-md font-bold' onClick={postThePost}>POST</button>
            </footer>
        </>
    );
}

export default CreatePostFooter;