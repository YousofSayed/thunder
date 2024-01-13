import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Textarea from "../Components/Shared/Textarea";
import { append, getFromTo, showMarquee, update } from "../js/global";
import { CocktailDB, addClickClass, getLocalDate, parse } from "../js/cocktail";
import Post from "../Components/Post";
import Button from "../Components/Shared/Button";
import Loader from '../Components/Shared/Loader'
import repostSchema from "../Schemas/repostSchema";
import { postSocket } from "../js/initSockets";

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
    const db = new CocktailDB(user.email);

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
        try {
            const postRes = await (await getFromTo('Posts', postIndex, postIndex))[0];
            postRes.schema.reposts = postRes.schema.reposts ? postRes.schema.reposts++ : 1;
            const updateRes = await update(`Posts!A${postIndex}`, postRes);
            const schema = repostSchema(user, context.repostContent, postRes.schema);
            const resBody = { type: 'repost', schema };
            const appendRes = await append('Posts', resBody);
            const index = appendRes.updates.updatedRange?.match(/\d+/ig)[0];
            resBody.schema.index = index;
            await (await db.openCollection('Reposts')).set({ _id: postRes.schema._id, date: getLocalDate() });
            postSocket.emit('msg',resBody);
            setTimeout(() => { navigate('/') }, 1000)
        }
        catch (error) {
            setTimeout(() => repost(ev), 1000)
            throw new Error(error.message)
        }
        finally {
            btn.disabled = false;
        }

    }

    return (
        <section className=" w-full h-full bg-white dark:bg-transparent  flex justify-center items-center">
            {
                context.post ?
                    <section className="p-2 container h-full max-h-[100%] overflow-x-auto bg-white dark:bg-[#080808] rounded-lg ">
                        <Textarea lengthLimit={100} context={context} setContext={setContext} overwriteValue={'repostContent'} />
                        <Post post={post} className={'h-fit  overflow-y-auto bg-[#eee]  dark:bg-[#000] hide-scrollbar my-3'} />
                        <Button clickCallback={repost}>Repost</Button>
                    </section>
                    :
                    <Loader />
            }
        </section>
    );
}

export default MakeRetweet;