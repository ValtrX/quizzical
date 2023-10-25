import { useState, useEffect, useMemo } from "react";
import Question from "./components/Question.jsx";

import Confetti from "react-confetti";
import { getQuestions, insertAllQuestions } from "./services/quizzical";

function App() {
  const [loading, setLoading] = useState(true);
  const [quizical, setQuizical] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedByUser, setSelectedByUser] = useState({});
  const [isChecked, setIsChecked] = useState(false);

  // Count correct answers
  const count = useMemo(() => {
    return questions.reduce((acc, question, index) => {
      if (question.correct_answer === selectedByUser[index]) {
        return acc + 1;
      }
      return acc;
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecked]);

  // Set selected option by user
  const handleOptionChange = (event, questionIndex) => {
    setSelectedByUser((prev) => ({
      ...prev,
      [questionIndex]: event.target.value,
    }));
  };

  // Reset game, when user click on play again we need to reset the state
  const onSubmitPlayAgain = () => {
    setSelectedByUser({});
    setQuestions((prev) =>
      prev.map((question) => {
        return {
          ...question,
          all_answers: insertAllQuestions(
            question.incorrect_answers,
            question.correct_answer
          ),
        };
      })
    );
  }

  // Get questions from API
  useEffect(() => {
    getQuestions()
      .then((questions) => setQuestions(questions))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="App">
        <div className="quizical-game">Loading...</div>
      </div>
    );
  }

  if (!loading && questions.length === 0) {
    return (
      <div className="App">
        <div className="quizical-game">No hay preguntas disponibles.</div>
      </div>
    );
  }

  if (!quizical) {
    return (
      <div className="quizical-intro">
        <h1>Quizical | by Carlos Bermudez</h1>
        <p>
          Esta es mi app de quizical en la cual tendras que escoger las
          respuestas correctas (la app está en ingles)
        </p>
        <button onClick={() => setQuizical(true)}> Empezar Juego </button>
      </div>
    );
  }

  return (
    <div className="App">
      {count >= 3 ? <Confetti /> : ""}

      <div className="quizical-game">
        <h1>Acabas de empezar el juego!</h1>

        <form
          className="quizical-form"
          onSubmit={(e) => {
            e.preventDefault();
            setIsChecked((prevIsChecked) => !prevIsChecked);
          }}
        >
          {questions.map((question, index) => (
            <Question
              key={question.question}
              questionTitle={question.question}
              allAnswers={question.all_answers}
              correctAnswer={question.correct_answer}
              selectedOption={selectedByUser[index]}
              onOptionChange={(event) => handleOptionChange(event, index)}
              checked={isChecked}
            />
          ))}

          {isChecked ? (
            <button
              type="submit"
              onClick={() => onSubmitPlayAgain()}
            >
              Play Again
            </button>
          ) : (
            <button type="submit">Check Questions</button>
          )}

          <h4>
            CORRECT ANSWERS{" "}
            {isChecked
              ? count + "/" + questions.length
              : "0/" + questions.length}
          </h4>
        </form>
      </div>
    </div>
  );
}

export default App;
