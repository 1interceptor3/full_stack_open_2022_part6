import { useSelector, useDispatch } from 'react-redux';
import { doVote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
    const dispatch = useDispatch();
    const anecdotes = useSelector(({ anecdotes, filter }) => {
        let output = [...anecdotes].sort((a, b) => b.votes - a.votes)
        if (filter) {
            return output.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()));
        }
        return output;
    });

    const vote = (id, content) => {
        dispatch(doVote(id));

        dispatch(setNotification(`you voted '${content}'`, 2));
    }

    return (
        <div>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnecdoteList;