import { $, GET, getCurrentTime, parse, parseToHTML, stringify } from '../js/cocktail';
import { createContext, useEffect, useState } from 'react';
import Textarea from './Shared/Textarea';
import IframeSectionHandler from './CreatePost/IframeSection';
import CreatePostMedia from './CreatePost/Media';
import CreatePostFooter from './CreatePost/Footer';
import { CreatePostHeader } from './CreatePost/Header';
export const CreatePostContext = createContext();

function CreatePost() {
    const [context , setContext] = useState({
        imagesMedia:[],
        charLength:0,
        postContent:'',
        video:[],
        iframeSrc:[],
        showIframeSection:false,
        showLoader:false,
        textAreaRef:null,
        iframeInputRef:null,
        user : parse(localStorage.getItem('user'))
    });

    return (
        <section className='w-full flex  flex-col bg-[#fff] dark:bg-[#000] h-fit rounded-lg p-2'>

            <CreatePostContext.Provider value={{context , setContext}}>
                
                <Textarea lengthLimit={5000} context={context} setContext={setContext} overwriteValue={'postContent'}/>

                <IframeSectionHandler />

                <CreatePostMedia />

                <CreatePostFooter/>

            </CreatePostContext.Provider>

        </section>

    );
}

export default CreatePost;