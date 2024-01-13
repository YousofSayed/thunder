const forTo = []
export const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry , i)=>{
        if(entry.isIntersecting  ){
            entry.target.animate(forTo[i].keyframes , forTo[i].options)
            animateObserver.unobserve(entry.target)
        }
    })
})

/**
 * It is observe element and animate it 
 * @param {Element|HTMLElement} element 
 * @param {CSSStyleDeclaration} from 
 * @param {CSSStyleDeclaration} to 
 * @param {KeyframeAnimationOptions} options 
 */
export const animate = (element, from, to , options) => {
    const keyframes = [
        from,
        to
    ];
    forTo.push({element, keyframes , options});
    animateObserver.observe(element);
}