/**
 * Returns repost schema
 * @param {object} user 
 * @param {string} retweetContent 
 * @param {object} post 
 * @returns 
 */
export default function repostSchema(user ,repostContent, post){
    return {
        userName:user.name,
        profImgId:user.profImgId,
        repostContent,
        post:post
    }
}