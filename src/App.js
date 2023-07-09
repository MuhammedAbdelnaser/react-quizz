import { useEffect, useReducer } from 'react';
import Header from './Header'
import Loader from './Loader'
import Error from './Error'
import Main from './Main'
import StartScreen from './StartScreen';
import Question from './Question';

const initialState = {
  questions: [],


  // loading, 'error', 'ready', 'active', 'finished'
  status: 'loading',
  index: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dateReceived':
      return { ...state, questions: action.payload, status: "ready" }
    case 'dateFailed':
      return { ...state, status: "error" }
    case 'start':
      return { ...state, status: "active" }
    default:
      throw new Error("Action is unknown")
  }
}
function App() {

  const [{ questions, status }, dispatch] = useReducer(reducer, initialState)

  const numQuestions = questions.length

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch(err => dispatch({ type: "dataFailed" }))
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen num={numQuestions} dispatch={dispatch} />}
        {status === 'active' && <Question />}
      </Main>
    </div>
  );
}

export default App;
