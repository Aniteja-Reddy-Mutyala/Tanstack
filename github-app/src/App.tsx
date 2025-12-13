import { useState } from "react";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueries,
  useMutation,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();
const fetchGitHubUser = async (user: string) => {
  const response = await fetch(`https://api.github.com/users/${user}`);
  if (!response.ok) {
    throw new Error("error in fetching the response");
  }
  return response.json();
};
const saveFavourite = async (data: { user: string; favourites: boolean }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if(Math.random()<.5){
    throw new Error("Unable to save");
  }
  return data;
};
function GitHubProfiles() {
  const usernames = ["Aniteja-Reddy-Mutyala", "moontahoe"];
  const results = useQueries({
    queries: usernames.map((user) => ({
      queryKey: ["github", "user", user],
      queryFn: () => fetchGitHubUser(user),
    })),
  });
  const refreshAllQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["github", "user"],
    });
  };
  const refreshUser = (user: string) => {
    queryClient.invalidateQueries({
      queryKey: ["github", "user", user],
    });
  };
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
  const[error,SetError]=useState<string|null>(null);
  const [favourites, setFavourites] = useState<Favourites>({});

  const favouriteMutation = useMutation({
    mutationFn: saveFavourite,
    onSuccess: (data) => {
      SetError(null);
      setFavourites((prev) => ({
        ...prev,
        [data.user]: data.favourites,
      }))
    },
    onError:(error:Error)=>{
      SetError(`Error:${error.message}`);
      console.error(error);
    }
  });

  const toggleFavourite = (user: string): void => {
    favouriteMutation.mutate({
      user,
      favourites: !favourites[user],
    });
  };

  const logCacheData = () => {
    const data = queryClient.getQueriesData({
      queryKey: ["github", "user"],
    });
    console.log(data);
  };
  const isLoading = results.some((query) => query.isLoading);
  if (isLoading) {
    return <div>Loading.....</div>;
  }

  return (
    <>
      <div className="profile-conatiner">
        <button onClick={refreshAllQueries}>Refresh all</button>
        <div>{error}</div>
        {results.map((user: any) => {
          if (!user.data) {
            return null;
          }
          const userName = user.data.login;
          const isFavourites = favourites[userName];
          const isPending =
            favouriteMutation.isPending &&
            favouriteMutation?.variables.user === userName;
          return (
            <div key={user.data.login} className="profile-card">
              <button onClick={logCacheData}>Log cache data</button>
              <img
                src={user.data.avatar_url}
                className="profile-avatar"
                alt={user.data.login}
              />
              <h2>{user.data.login}</h2>
              <p>{user.data.location}</p>
              <button onClick={() => toggleFavourite(user.data.login)}>
                {isPending
                  ? "...Saving"
                  : isFavourites
                  ? "*Favourited"
                  : "* add to favourites"}
              </button>
              <button onClick={() => refreshUser(user.data.login)}>
                Refresh user
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
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
