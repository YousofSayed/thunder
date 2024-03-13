import { defineAnimation, turnOnAnimation } from "./cocktail";

defineAnimation({
    name:'fade-in-left',
    from:{
        transform:`translateX(-50%)`,
        opacity:0,
    },
    to:{
        transform:`translateX(0)`,
        opacity:1,
    },
    duration:'.3s'
});

defineAnimation({
    name:'fade-in-right',
    from:{
        transform:`translateX(50%)`,
        opacity:0,
    },
    to:{
        transform:`translateX(0)`,
        opacity:1,
    },
    duration:'.3s'
});

turnOnAnimation(12);