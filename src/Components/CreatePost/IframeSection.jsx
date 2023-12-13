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
        // addClickClass(ev.currentTarget , 'click');
        // setIframeInputValue()
        const parsedIframeSrc = parseToHTML(ev.target.value)?.src;
        parsedIframeSrc ? setContext({...context , iframeSrc:[parsedIframeSrc]}) : null;
        
    };

    return (
        <>
            {
                showIframeSection
                &&
                <section id='iframeSection' className='flex  items-center'>
                    <input ref={inputRef} className='w-full p-3 outline-none bg-[#eee] dark:bg-gray-900 my-2 font-bold rounded-lg text-cyan-400 underline' type="text" placeholder='Enter Iframe' onInput={(e) => { uploadIframe(e) }} />
                    {/* <button className='w-[50px] h-full bg-cyan-600 rounded-lg font-bold' onClick={uploadIframe}>OK</button> */}
                </section>
            }
        </>
    );
}

export default IframeSectionHandler;