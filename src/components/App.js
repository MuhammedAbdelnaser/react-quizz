
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
import { useQuiz } from '../contexts/QuizContext';

/*
TODO 1- Select Specific Number of Questions
TODO 2- Select Difficulty of Questions
TODO 3- Upload the highest score to fake API to refetch it when reload
TODO 4- Store all answers in an array so the user can go forward or back
*/
export default function App() {
  const { status } = useQuiz();



  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <>
            <StartScreen
            />
          </>
        )
        }
        {status === "active" && (
          <>
            <Progress />
            <Question />
            <Footer>
              <Timer />
            </Footer>
            <NextButton />
          </>
        )}
        {
          status === "finished" && (
            <FinishScreen />
          )
        }
      </Main>
    </div>
  );
}