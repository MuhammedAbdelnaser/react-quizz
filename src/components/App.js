import { useEffect, useReducer } from 'react';
import Header from './Header'
import Loader from './Loader'
import Error from './Error'
import Main from './Main'
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';

const initialState = {
  questions: [],

  // loading, 'error', 'ready', 'active', 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
};


function reducer(state, action) {
  switch (action.type) {
    case "dateReceived":
      return { ...state, questions: action.payload, status: "ready" }
    case "dateFailed":
      return { ...state, status: "error" }
    case "start":
      return { ...state, status: "active" }
    case "newAnswer":
      const question = state.questions.at(state.index)
      return { ...state, answer: action.payload, points: action.payload === question.correctOption ? state.points + question.points : state.points }
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null }
    case "finish":
      return { ...state, status: "finished", highscore: state.points > state.highscore ? state.points : state.highscore }
    case "restart":
      return { ...initialState, questions: state.question, status: "ready" }
    default:
      throw new Error("Action is unknown")
  }
}

function App() {

  const [{ questions, status, index, answer, points, highscore }, dispatch] = useReducer(reducer, initialState)

  const numQuestions = questions.length
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0)

  useEffect(() => {

    fetch("http://localhost:8000/questions")
      .then((res) => { return res.json() })
      .then((data) =>
        dispatch({ type: "dataReceived", payload: (data) })
      )
      .catch((err) => dispatch({ type: "dataFailed" }))
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "error" && <Error />}
        {status === "loading" && <Loader />}
        {status === "ready" && <StartScreen num={numQuestions} dispatch={dispatch} />}
        {status === "active" && (
          <>
            <Progress
              index={index}
              points={points}
              numQuestions={numQuestions}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton dispatch={dispatch} answer={answer} numQuestions={numQuestions} index={index} />
          </>
        )}
        {
          status === "finish" && (
            <>
              <Progress
                index={index}
                points={points}
                numQuestions={numQuestions}
                maxPossiblePoints={maxPossiblePoints}
                answer={answer}
              />
              <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore} dispatch={dispatch} />
            </>
          )
        }
      </Main>
    </div>
  );
}

export default App;