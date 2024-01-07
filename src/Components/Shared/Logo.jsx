import logo from '../../Assets/images/logo.svg'
function Logo() {
    return (
        // <header className="flex justify-center w-full h-fit p-3 " >
            <img src={logo} alt="thunder" className='max-h-[30px] max-w-[40px] dark:invert-[100%]' title='thunder text logo' loading='lazy' />
        // </header>
    );
}

export default Logo;