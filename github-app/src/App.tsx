import { useState } from "react";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueries,
} from "@tanstack/react-query";
const queryClient = new QueryClient();
const fetchGitHubUser = async (user: string) => {
  const response = await fetch(`https://api.github.com/users/${user}`);
  if (!response.ok) {
    throw new Error("error in fetching the response");
  }
  return response.json();
};
function GitHubProfiles() {
  const usernames = ["Aniteja-Reddy-Mutyala", "moontahoe"];
  const results = useQueries({
    queries: usernames.map((user) => ({
      queryKey: ["user", user],
      queryFn: () => fetchGitHubUser(user),
    })),
  });
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
  interface Favourites {
    [username: string]: boolean;
  }
  const [favourites, setFavourites] = useState<Favourites>({});

  const toggleFavourite = (user: string): void => {
    setFavourites((prev) => ({
      ...prev,
      [user]: !prev[user],
    }));
  };
  const logCacheData=()=>{
    const data=queryClient.getQueriesData({
      queryKey:["user"]
    })
    console.log(data)
  }
  const isLoading = results.some((query) => query.isLoading);
  if (isLoading) {
    return <div>Loading.....</div>;
  }

  return (
    <>
      <div className="profile-conatiner">
        
      {results.map((user: any) => {
        if (!user.data) {
          return null;
        }
        return (
          
          <div key={user.data.login} className="profile-card">
            <button onClick={logCacheData}>Log cache data</button>
            <img src={user.data.avatar_url} className="profile-avatar" alt={user.data.login} />
            <h2>{user.data.login}</h2>
            <button onClick={() => toggleFavourite(user.data.login)}>
              {favourites[user.data.login]
                ? "*Favourited"
                : "* add to favourites"}
            </button>
          </div>
        );
      })}
      </div>
    </>
  );
}
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GitHubProfiles />
    </QueryClientProvider>
  );
}

export default App;
