import { useContext } from "react";
import { useMutation } from "react-query";
import NotificationContext from "../NotificationContext";
import { createAnecdote } from "../requests";


const AnecdoteForm = ({ queryClient }) => {
    const [notification, dispatch] = useContext(NotificationContext);

    const newAnecdoteMutation = useMutation(createAnecdote, {
        onSuccess: () => {
            queryClient.invalidateQueries("anecdotes");
        },
    });

    const onCreate = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        newAnecdoteMutation.mutate({ content, votes: 0 }, {
            onSuccess: () => {
                dispatch({ type: "SET", payload: `anecdote '${content}' was added` });
                setTimeout(() => {
                    dispatch({ type: "REMOVE" })
                }, 5000);
            },
            onError: error => {
                dispatch({ type: "SET", payload: error.response.data.error });
                setTimeout(() => {
                    dispatch({ type: "REMOVE" });
                }, 5000);
            }
        });
    }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
