import { API_URL } from "../config";

export const insertAllQuestions = (incorrectAnswers, correctAnswers) => {
  let allAnswers = [];
  allAnswers.push(...incorrectAnswers);
  allAnswers.splice(
    ((allAnswers.length + 1) * Math.random()) | 0,
    0,
    correctAnswers
  );
  return allAnswers;
};

export const getQuestions = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();

  return data.results.map((question) => {
    return {
      ...question,
      all_answers: insertAllQuestions(
        question.incorrect_answers,
        question.correct_answer
      ),
    };
  });
};
