import { $, GET, getCurrentTime, parse, parseToHTML, stringify } from '../js/cocktail';
import { createContext, useEffect, useState } from 'react';
import Textarea from './Shared/Textarea';
import IframeSectionHandler from './CreatePost/IframeSection';
import CreatePostMedia from './CreatePost/Media';
import CreatePostFooter from './CreatePost/Footer';
export const CreatePostContext = createContext();

function CreatePost() {
    const [context , setContext] = useState({
        imagesMedia:[],
        charLength:0,
        postContent:'',
        video:[],
        iframeSrc:[],
        showIframeSection:false,
        textAreaRef:null,
        iframeInputRef:null,
        user : parse(localStorage.getItem('user'))
    });

    return (
        <section className='flex ring-1 flex-col bg-gray-950 mt-2 h-fit rounded-lg p-2'>

            <CreatePostContext.Provider value={{context , setContext}}>
                <Textarea lengthLimit={5000} context={context} setContext={setContext}/>

                <IframeSectionHandler />

                <CreatePostMedia />

                <CreatePostFooter/>

            </CreatePostContext.Provider>

        </section>

    );
}

export default CreatePost;