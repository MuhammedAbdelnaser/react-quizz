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
import Footer from './Footer';
import Timer from './Timer';

/*
TODO 1- Select Specific Number of Questions
TODO 2- Select Difficulty of Questions
TODO 3- Upload the highest score to fake API to refetch it when reload
TODO 4- Store all answers in an array so the user can go forward or back
*/
const SECS_PER_QUES = 30;

const initialState = {
  questions: [],

  // loading, 'error', 'ready', 'active', 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};


function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUES,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action unkonwn");
  }
}

export default function App() {

  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0)

  useEffect(function () {

    fetch("https://my-json-server.typicode.com/MuhammedAbdelnaser/react-quizz/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }))
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <>
            <StartScreen num={numQuestions} dispatch={dispatch}
            />
          </>
        )
        }
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
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
            </Footer>
            <NextButton dispatch={dispatch} answer={answer} numQuestions={numQuestions} index={index} />
          </>
        )}
        {
          status === "finished" && (
            <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore} dispatch={dispatch} />
          )
        }
      </Main>
    </div>
  );
}