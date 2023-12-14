import { useState } from "react";
import Textarea from "../Shared/Textarea";
import { isEnglishLang, isSpecialChars, isValidPassword } from "../../js/cocktail";

function PostArticle({ context, setContext }) {
    const [showMore, setShowMore] = useState(false);
    const { showPostEditBtn, editeValue, content } = context;
    const { language } = navigator;
    const mainContent = content.slice(0, 500);
    const moreContent = content.slice(500);


    return (
        <>
            {!showPostEditBtn ?

                <article id="postContent" dir={isEnglishLang(content) ? 'ltr' : 'rtl'} className={`my-2 pb-2 font-bold rounded-lg text-black dark:text-white text-justify whitespace-pre-line break-words `} >
                    {mainContent}
                    {!showMore && content.length > 500 && <span className="text-cyan-400 cursor-pointer" onClick={() => { setShowMore(true) }}> ...showmore</span>}
                    {showMore && content.length > 500 && <span onClick={() => { setShowMore(false) }}>{moreContent}</span>}
                </article>

                :

                <Textarea lengthLimit={5000} value={editeValue} focus={true} context={context} setContext={setContext} overwriteValue={'editeValue'} />
            }
        </>
    );
}

export default PostArticle;