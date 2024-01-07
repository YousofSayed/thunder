const Marquee = () => {
    return (
        <marquee className="w-full h-[2px] scale-0" id="marq" direction="right" scrollamount="50"><div className='h-[2px] w-[150px] bg-black dark:bg-white'></div></marquee>
    );
}

export { Marquee };