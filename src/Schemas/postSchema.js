import { getCurrentTime, uniqueID } from "../js/cocktail"

export default function postSchema({ user, postContent, images, vid, iframeSrc }) {
    return {
        _id:uniqueID(),
        userName: user.name,
        userID: user.id,
        date: getCurrentTime(),
        email: user.email,
        profImgId: user.profImgId,
        postContent,
        media: {
            images,
            vid,
            iframeSrc
        },
        reacts: {
            love: 0,
            haha: 0,
            sad: 0,
            angry: 0,
        },
        retweets: 0,
        watches: 0
    }
}