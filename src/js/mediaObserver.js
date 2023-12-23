import { $, $a } from "./cocktail";
import tb from "./tb";

export const mediaObserver = new IntersectionObserver((entries) => {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            const vid = $(`#${id} video`);
            const imgs = $a(`#${id} img`);
            // if (vid && !vid.src) {
            //     vid.src = await tb.getFileFromBot(vid.getAttribute('tbid'))
            //     vid.load();
            //     vid.addEventListener('loadeddata', () => {
            //         console.log('load');
            //         vid.play();
            //     })

            // }
             if (vid && vid.src) {
                vid.play();
                
            }

            // if (imgs.length) {
            //     imgs.forEach(async img => {
            //         if (img.src) return;
            //         img.src = await tb.getFileFromBot(img.getAttribute('tbid'))
            //     })
            // }
            // mediaObserver.unobserve(entry.target);
        }
        else {
            const vid = $(`#${entry.target.id} video`);
            vid && vid.pause();
        }
    })
})
