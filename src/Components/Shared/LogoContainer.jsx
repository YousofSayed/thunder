const LogoContainer = ({className , children}) => {
    return ( <header className={`flex justify-center w-full h-fit p-3  ${className}`}>{children}</header> );
}

export { LogoContainer };