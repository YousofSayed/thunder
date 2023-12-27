import { $, $a } from "./cocktail";
import { getFromTo, update } from "./global";
import tb from "./tb";

export const mediaObserver = new IntersectionObserver((entries) => {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            const vid = $(`#${id} video`);
            const imgs = $a(`#${id} img`);
            if (vid && vid.getAttribute('loaded') == 'false') {
                const tbid = vid.dataset.tbid;
                const newURL = await tb.getFileFromBot(tbid);
                vid.src = newURL;
                vid.load();
                vid.removeAttribute('loaded');
                const index = +vid.getAttribute('index');
                const currentPostFromDB = await getFromTo('Posts', index, index);
                if (currentPostFromDB[0].type == 'repost') {
                    currentPostFromDB[0].schema.post.media.vid = [{ url: newURL, id: tbid }];
                }
                else if (currentPostFromDB[0].type == 'post') {
                    currentPostFromDB[0].schema.media.vid = [{ url: newURL, id: tbid }];
                }
                const updateRes = await update(`Posts!A${index}`, currentPostFromDB[0]);
                console.log('Video update is done');

            }
            else if (vid) {
                vid.play();
            }

            if (imgs.length) {
                let isOneImgNotLoaded, index;
                const newMediaImages = [];
                
                imgs.forEach(async img => {
                    const { tbid } = img.dataset;
                    const newItem = { url: img.src, id: tbid };
                    if (img.getAttribute('loaded') == 'false') {
                        isOneImgNotLoaded = true;
                        index = +img.getAttribute('index');
                        const newURL = await tb.getFileFromBot(tbid)
                        img.src = newURL;
                        newItem.url = newURL;
                    }
                    newMediaImages.push(newItem)
                    img.removeAttribute('loaded');
                });

                if (!isOneImgNotLoaded) return;
                const currentPostFromDB = await getFromTo('Posts', index, index);
                if (currentPostFromDB[0].type == 'repost') {
                    currentPostFromDB[0].schema.post.media.images = newMediaImages;
                }
                else if (currentPostFromDB[0].type == 'post') {
                    currentPostFromDB[0].schema.media.images = newMediaImages;
                }
                const updateRes = await update(`Posts!A${index}`, currentPostFromDB[0]);
                console.log('Images update res is done');

            }
            // mediaObserver.unobserve(entry.target);
        }
        else {
            const vid = $(`#${entry.target.id} video`);
            vid && vid.pause();
        }
    })
})
