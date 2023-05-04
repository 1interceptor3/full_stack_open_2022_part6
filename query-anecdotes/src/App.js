import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import NotificationContext from "./NotificationContext";
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from "./requests";

const App = () => {
    const [notification, dispatch] = useContext(NotificationContext);

    const queryClient = useQueryClient();
    const updateAnecdoteMutation = useMutation(updateAnecdote, {
        onSuccess: () => {
            queryClient.invalidateQueries("anecdotes");
        },
    });

    const { isLoading, isError, data } = useQuery("anecdotes", getAnecdotes, {
        refetchOnWindowFocus: false,
        retry: 1
    });

    const handleVote = (anecdote) => {
        updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
        dispatch({ type: "SET", payload: `anecdote '${anecdote.content}' voted` });
        setTimeout(() => {
            dispatch({ type: "REMOVE" });
        }, 5000);
    }

    if (isLoading) {
        return <div>loading data...</div>
    }

    if (isError) {
        return <div>anecdote service not available due to problems in server</div>;
    }

    return (
        <div>
            <h3>Anecdote app</h3>

            <Notification />
            <AnecdoteForm queryClient={queryClient} />

            {data.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App
