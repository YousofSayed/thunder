function Button({clickCallback , children}) {
    return ( 
        <button className='px-2 py-1 bg-black text-white dark:bg-white dark:text-black rounded-md font-bold' onClick={clickCallback}>{children}</button>
     );
}

export default Button;