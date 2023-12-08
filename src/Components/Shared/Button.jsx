function Button({clickCallback , children}) {
    return ( 
        <button className='px-2 py-1 bg-cyan-600 rounded-md font-bold' onClick={clickCallback}>{children}</button>
     );
}

export default Button;