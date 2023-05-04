import { createSlice } from "@reduxjs/toolkit";

// const anecdotesAtStart = [
//     'If it hurts, do it more often',
//     'Adding manpower to a late software project makes it later!',
//     'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//     'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//     'Premature optimization is the root of all evil.',
//     'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]
//
// const getId = () => (100000 * Math.random()).toFixed(0)
//
// const asObject = (anecdote) => {
//     return {
//         content: anecdote,
//         id: getId(),
//         votes: 0
//     }
// }
//
// const initialState = anecdotesAtStart.map(asObject);

import anecdoteService from "../services/anecdotes";

const anecdotesSlice = createSlice({
    name: "anecdotes",
    initialState: [],
    reducers: {
        doVote(state, action) {
            const id = action.payload;
            const anecdoteToChange = state.find(a => a.id === id);
            const changedAnecdote = {
                ...anecdoteToChange,
                votes: anecdoteToChange.votes + 1
            };
            return state.map(a => a.id !== id ? a : changedAnecdote);
        },
        updateAnecdote(state, action) {
            return state.map(a => a.id !== action.payload.id ? a : action.payload);
        },
        appendAnecdote(state, action) {
            return state.concat(action.payload);
        },
        setAnecdotes(state, action) {
            return action.payload;
        }
    }
});

export const { appendAnecdote, updateAnecdote, setAnecdotes } = anecdotesSlice.actions;

export const initAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll();
        dispatch(setAnecdotes(anecdotes));
    };
};

export const createAnecdote = content => {
    return async dispatch => {
        const newAnecdote = await anecdoteService.createNew(content);
        dispatch(appendAnecdote(newAnecdote));
    };
};

export const doVote = id => {
    return async (dispatch, getState) => {
        const { anecdotes } = getState();
        const anecdoteToUpdate = anecdotes.find(a => a.id === id);
        const updatedAnecdote = await anecdoteService.update(
            id, { ...anecdoteToUpdate, votes: anecdoteToUpdate.votes + 1 }
        );
        dispatch(updateAnecdote(updatedAnecdote));
    };
};

export default anecdotesSlice.reducer;