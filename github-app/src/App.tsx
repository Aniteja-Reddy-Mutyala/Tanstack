import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueries
} from "@tanstack/react-query";
const queryClient = new QueryClient();
const fetchGitHubUser= async(user: any)=>{
  const response=await fetch(`https://api.github.com/users/${user}`)
  if (!response.ok){
    throw new Error("error in fetching the response")
  }
  return response.json();
}
function GitHubProfiles(){
  const usernames=["Aniteja-Reddy-Mutyala","moontahoe"]
  const results=useQueries({
    queries:usernames.map(user=>({
      queryKey:["user",user],
      queryFn:()=>fetchGitHubUser(user)
    }))
  })
  // console.log(data)
  // if (isLoading){
  //   return <div>Loading!!!!!</div>
  // }
  // if(isError){
  //   return <div>Error!!!!</div>
  // }
  // setTimeout(()=>{
  //   console.log("")
  // },500000000);
  const isLoading=results.some(query=>query.isLoading)
  if (isLoading){
    return <div>Loading.....</div>
  }
  
  return (
    <>
  <div >Github profile component</div>
   {results.map((user:any)=>(
    <div key={user.data.login}>{user.data.login}
    <img src={user.data.avatar_url} alt={user.data.login}/>
    </div>
   ))}
   
  </>
  )
}
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GitHubProfiles/>
    </QueryClientProvider>
  );
}

export default App;
