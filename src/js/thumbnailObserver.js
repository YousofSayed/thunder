import tb from "./tb";

export const thumbnailObserver = new IntersectionObserver((entries)=>{
    entries.forEach(async (thumbnail , i)=>{
        if(thumbnail.isIntersecting){
            const id = thumbnail.target.getAttribute('tbid');
            if(id)thumbnail.target.src = await tb.getFileFromBot(id);
            thumbnail.target.removeAttribute('tbid')
        }
    })
    
});