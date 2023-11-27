import Header from "../Components/Header";
import PostsView from "../Components/PostsView";

function App() {
    return (
        <>
            <Header />
            <main className="w-full h-[calc(100%-74px)] p-2 flex justify-center">
                <PostsView />
            </main>
        </>
    );
}

export default App;