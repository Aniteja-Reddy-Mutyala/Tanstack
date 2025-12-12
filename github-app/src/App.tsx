import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
const queryClient = new QueryClient();
function GitHubProfile(){
  return <div >Github profile component</div>
}
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GitHubProfile/>
    </QueryClientProvider>
  );
}

export default App;
