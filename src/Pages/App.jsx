import Header from "../Components/Header";
import PostsView from "../Components/PostsView";
import LogOrSign from "../Components/LogOrSign"
import { parse } from "../js/cocktail";

function App() {
    const user = parse(localStorage.getItem('user'));

    
    return (
        <>
            <Header />
            <main className="w-full h-[calc(100%-74px)] p-2 flex justify-center relative">
                {user ? <PostsView /> : <LogOrSign/>}
            </main>
        </>
    );
}

export default App;