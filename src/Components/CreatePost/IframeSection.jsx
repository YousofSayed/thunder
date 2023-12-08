import { useContext, useEffect, useRef, useState } from "react";
import { addClickClass, parseToHTML } from "../../js/cocktail";
import { CreatePostContext } from "../CreatePost";

function IframeSectionHandler() {
    const [iframeInputValue, setIframeInputValue] = useState(null);
    const inputRef = useRef();
    const {context , setContext} = useContext(CreatePostContext);
    const {showIframeSection  } = context;
    context.iframeInputRef = inputRef.current;

    const uploadIframe = (ev) => {
        addClickClass(ev.currentTarget , 'click');
        const parsedIframeSrc = parseToHTML(iframeInputValue).src;
        setContext({...context , iframeSrc:[parsedIframeSrc]})
    };

    return (
        <>
            {
                showIframeSection
                &&
                <section id='iframeSection' className='flex  items-center gap-2 h-full'>
                    <input ref={inputRef} className='w-full p-2 outline-none bg-gray-900 my-2 rounded-lg text-cyan-400 underline' type="text" placeholder='Enter Iframe' onInput={(e) => { setIframeInputValue(e.target.value) }} />
                    <button className='w-[50px] h-full bg-cyan-600 rounded-lg p-2 font-bold' onClick={uploadIframe}>OK</button>
                </section>
            }
        </>
    );
}

export default IframeSectionHandler;