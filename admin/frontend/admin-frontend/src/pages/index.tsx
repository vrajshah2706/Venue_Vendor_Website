import LogIn from "../components/signIn"
import Header from "../components/header";
import Login from "../components/signIn";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F5FF] flex flex-col"> {/* it will stack header, content, footer vertically */}
      <Header/>
      <main className="flex-grow w-full max-w-8xl mx-auto px-4 pt-12 pb-10 space-y-8">
        
       <Login/>
  
    
      </main>
     
    </div>
  
    
  );
}
