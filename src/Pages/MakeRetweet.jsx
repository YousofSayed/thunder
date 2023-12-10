import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Textarea from "../Components/Shared/Textarea";
import { append, getFromTo, showMarquee, update } from "../js/global";
import { addClickClass, parse } from "../js/cocktail";
import Post from "../Components/Post";
import Button from "../Components/Shared/Button";
import Loader from '../Components/Shared/Loader'
import repostSchema from "../Schemas/repostSchema";

function MakeRetweet() {
    const [context, setContext] = useState({
        repostContent: '',
        charLength: 0,
        post: null,
    });
    const { post } = context;
    const { postIndex } = useParams();
    const navigate = useNavigate();
    const user = parse(localStorage.getItem('user'));

    useEffect(() => {
        getPost();
    }, []);

    const getPost = async () => {
        try {
            const post = await getFromTo('Posts', postIndex, postIndex);
            setContext({ ...context, post: post[0].schema })
        } catch (error) {
            setTimeout(() => getPost(), 1000);
            throw new Error(error.message);
        }
    };


    const repost = async (ev) => {
        const btn = ev.currentTarget;
        btn.disabled = true;
        addClickClass(btn, 'click');
        showMarquee(true);
        try {
            const postRes = await(await getFromTo('Posts',postIndex,postIndex))[0];
            postRes.schema.repost = postRes.schema.repost ? postRes.schema.repost++ : 1;
            const updateRes = await update(`Posts!A${postIndex}`,postRes);
            const resBody = { type: 'repost', schema: repostSchema(user, context.repostContent, postRes) };
            const appendRes = await append('Posts', resBody);
            console.log(updateRes , appendRes);
            setTimeout(() => { navigate('/') }, 1000)
        }
        catch (error) {
            setTimeout(() => repost(ev), 1000)
            throw new Error(error.message)
        }
        finally {
            btn.disabled = false;
            showMarquee(false);
        }

    }

    return (
        <section className="absolute w-full h-full p-2 dark:bg-gray-950  flex justify-center items-center">
            {
                context.post ?
                    <section className="p-2 container max-h-[100%] overflow-x-auto dark:bg-gray-900 rounded-lg ring-1">
                        <Textarea lengthLimit={100} context={context} setContext={setContext} overwriteValue={'repostContent'} />
                        <Post post={post} className={'h-fit max-h-[400px] overflow-y-auto hide-scrollbar'} />
                        <Button clickCallback={repost}>Retweet</Button>
                    </section>
                    :
                    <Loader />
            }
        </section>
    );
}

export default MakeRetweet;