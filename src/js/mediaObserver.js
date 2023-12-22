import { $, $a } from "./cocktail";
import tb from "./tb";

export const mediaObserver = new IntersectionObserver((entries) => {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            const vid = $(`#${id} video`);
            const imgs = $a(`#${id} img`);
            if (vid) {
                vid.play();
                // vid.muted = true;
            }

            // if (imgs.length) {
            //     imgs.forEach(async img => {
            //         img.src = await tb.getFileFromBot(img.getAttribute('tbid'))
            //     })
            // }
            // mediaObserver.unobserve(entry.target);
        }
        else{
            const vid = $(`#${entry.target.id} video`);
            vid && vid.pause();
        }
    })
})
