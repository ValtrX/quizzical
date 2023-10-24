import { useState, useEffect } from "react";
import data from "./data.json";
import Question from "./question.jsx";
import he from "he";
import Confetti from "react-confetti";

function App() {
  const [quizical, setQuizical] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [count, setCount] = useState(0);

  const getData = async () => {
    const res = await fetch(
      "https://opentdb.com/api.php?amount=3&category=15&difficulty=easy&type=multiple"
    );
    const data = await res.json();

    const updatedQuestions = () =>
    data.results.map((question) => {
      return {
        ...question,
        all_answers: insertAllQuestions(
          question.incorrect_answers,
          question.correct_answer
        ),
        chosen_answer: null,
      };
    });
    
    setQuestions(updatedQuestions);
  };

  useEffect(() => {
    getData();
  }, []);

  function startQuizical() {
    setQuizical(true);
  }

  const handleOptionChange = (event, questionIndex) => {
    const newSelectedOptions = [...questions];
    newSelectedOptions[questionIndex].chosen_answer = event.target.value;
    setQuestions(newSelectedOptions);
  };

  function insertAllQuestions(incorrectAnswers, correctAnswers) {
    let allAnswers = [];
    allAnswers.push(...incorrectAnswers);
    allAnswers.splice(
      ((allAnswers.length + 1) * Math.random()) | 0,
      0,
      correctAnswers
    );
    return allAnswers;
  }

  function checkCounts() {
    questions.forEach((question) => {
      if (question.correct_answer === question.chosen_answer) {
        setCount((prevCount) => prevCount + 1);
      }
    });

    if (isChecked) {
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) => {
          return {
            ...question,
            all_answers: insertAllQuestions(
              question.incorrect_answers,
              question.correct_answer
            ),
            chosen_answer: null,
          };
        })
      );
      setCount(0);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsChecked((prevIsChecked) => !prevIsChecked);
  }

  const questionElements = () =>
    questions.map((question, index) => {
      return (
        <Question
          key={question.question}
          questionTitle={he.decode(question.question)}
          allAnswers={question.all_answers}
          correctAnswer={question.correct_answer}
          selectedOption={question.chosen_answer}
          onOptionChange={(event) => handleOptionChange(event, index)}
          checked={isChecked}
        />
      );
    });

  console.log(questions);
  return (
    <div className="App">
      {count >= 3 ? <Confetti /> : ""}
      {quizical ? (
        <div className="quizical-game">
          <h1>Acabas de empezar el juego!</h1>

          <form className="quizical-form" onSubmit={handleSubmit}>
            {questions && questions.length > 0
              ? questionElements()
              : "Cargando preguntas..."}

            <button type="submit" onClick={checkCounts}>
              {isChecked ? "Play Again" : "Check Questions"}{" "}
            </button>
            <h4>
              CORRECT ANSWERS{" "}
              {isChecked
                ? count + "/" + questions.length
                : "0/" + questions.length}
            </h4>
          </form>
        </div>
      ) : (
        <div className="quizical-intro">
          <h1>Quizical | by Carlos Bermudez</h1>
          <p>
            Esta es mi app de quizical en la cual tendras que escoger las
            respuestas correctas (la app está en ingles)
          </p>
          <button onClick={startQuizical}> Empezar Juego </button>
        </div>
      )}
    </div>
  );
}

export default App;
