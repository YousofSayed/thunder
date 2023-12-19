import { $, $a } from "./cocktail";
import tb from "./tb";

export const mediaObserver = new IntersectionObserver((entries) => {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            const vid = $(`#${id} video`);
            const imgs = $a(`#${id} img`);
            if (vid) {
                // if (vid.src) return;
                // vid.src = await tb.getFileFromBot(vid.getAttribute('tbid'));
                vid.autoplay = true;
                // vid.muted = true;
            }

            // if (imgs.length) {
            //     imgs.forEach(async img => {
            //         img.src = await tb.getFileFromBot(img.getAttribute('tbid'))
            //     })
            // }
            mediaObserver.unobserve(entry.target);
        }
    })
}, {
    rootMargin: `1000000px`
})