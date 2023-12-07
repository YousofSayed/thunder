export default function retweetSchema(user , post){
    return {
        userName:user.name,
        profImgId:user.profImgId,
        post:post
    }
}