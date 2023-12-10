import { useContext, useState } from "react"
// import { PostContext } from "../Post"
import Textarea from "../Shared/Textarea";

function PostArticle({context , setContext}) {
    const [showMore, setShowMore] = useState(false)
    // const {context , setContext} = useContext(PostContext);
    const { showPostEditBtn , editeValue ,postContent} = context;
    const mainContent = postContent.slice(0, 500);
    const moreContent = postContent.slice(500);
    return (
        <>
            {   !showPostEditBtn ? 
                
                <article id="postContent" className={`my-2 pb-2 font-bold rounded-lg text-justify break-words `} >
                    {mainContent}
                    {!showMore && postContent.length > 500 && <span className="text-cyan-400 cursor-pointer" onClick={() => { setShowMore(true) }}> ...showmore</span>}
                    {showMore && postContent.length > 500 && <span onClick={() => { setShowMore(false) }}>{moreContent}</span>}
                </article>

                :

                <Textarea lengthLimit={5000} value={editeValue} focus={true} context={context} setContext={setContext} overwriteValue={'editeValue'}/>
            }
        </>
    );
}

export default PostArticle;