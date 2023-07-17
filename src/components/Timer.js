import React, { useEffect } from 'react'
import { useQuiz } from '../contexts/QuizContext';

function Timer() {
    const { dispatch, secondsRemaining } = useQuiz();
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    useEffect(function () {
        const id = setInterval(() => {
            dispatch({ type: 'tick' })
        }, 1000);
        // Clear interval on unmount to prevent memory leaks.
        return () => clearInterval(id);
    }, [dispatch])

    return (
        <div className='timer'>{mins < 10 && "0"}{mins}:{secs < 10 && "0"}{secs}</div>
    )
}

export default Timer