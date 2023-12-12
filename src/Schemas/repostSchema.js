import { getCurrentTime, uniqueID } from "../js/cocktail";

/**
 * Returns repost schema
 * @param {object} user 
 * @param {string} retweetContent 
 * @param {object} post 
 * @returns 
 */
export default function repostSchema(user, repostContent, post) {
    return {
        _id: uniqueID(),
        userName: user.name,
        profImgId: user.profImgId,
        repostContent,
        date: getCurrentTime(),
        post: post
    }
}