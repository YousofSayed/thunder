import Header from "../Components/Header";
import Posts from "../Components/Posts";

function App() {
    return (
        <>
            <Header />
            <main className="w-full h-[calc(100%-74px)] p-2 flex justify-center">
                <Posts />
            </main>
        </>
    );
}

export default App;