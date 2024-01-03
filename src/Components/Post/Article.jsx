import { useState } from "react";
import Textarea from "../Shared/Textarea";
import { isArabicLang, isEnglishLang, isSpecialChars, isValidPassword } from "../../js/cocktail";

function PostArticle({ context, setContext }) {
    const [showMore, setShowMore] = useState(false);
    const { showPostEditBtn, editeValue, content } = context;
    const { language } = navigator;
    const mainContent = content.slice(0, 500);
    const moreContent = content.slice(500);

    const handleDir = (text) => {
        const defaultDir = navigator.language.includes('ar') ? 'rtl' : 'ltr';
        switch (true) {
            case (isArabicLang(text).length > isEnglishLang(text).length):
                return 'rtl';

            case (isArabicLang(text).length < isEnglishLang(text).length):
                return 'ltr';

            case (isEnglishLang(text).ok):
                return 'ltr';

            case (isArabicLang(text).ok):
                return 'rtl';
            default:
                return defaultDir;
        }
    }

    return (
        <>
            {!showPostEditBtn ?

                <article id="postContent" dir={handleDir(content)} onClick={() => { showMore? setShowMore(false) : setShowMore(true) }} className={`my-2 pb-2 font-light rounded-lg text-black dark:text-white  whitespace-pre-line break-words `} >
                    {mainContent}
                    {!showMore && content.length > 500 && <span className="text-cyan-400 cursor-pointer" > ...showmore</span>}
                    {showMore && content.length > 500 && <span >{moreContent}</span>}
                </article>

                :

                <Textarea lengthLimit={5000} value={editeValue} focus={true} context={context} setContext={setContext} overwriteValue={'editeValue'} />
            }
        </>
    );
}

export default PostArticle;