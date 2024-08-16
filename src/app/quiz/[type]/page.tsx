"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function getQuestions(type: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/questions/${type}`
    );
    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return { data: [], numbers: [] };
  }
}

type userAnswer = {
  questionIndex: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
};

export default function Quiz({ params }: { params: { type: string } }) {
  const [data, setData] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [timer, setTimer] = useState(60);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [userAnswers, setUserAnswers] = useState<userAnswer[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);
  const [timerAdjustment, setTimerAdjustment] = useState<number | null>(null);

  // Get Data
  useEffect(() => {
    const fetchData = async () => {
      const quizData = await getQuestions(params.type);
      setData(quizData.data);
      setNumbers(quizData.numbers);
    };

    fetchData();
  }, [params.type]);

  // Start Timer
  useEffect(() => {
    const id = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(id);
          setQuizFinished(true);
          return 0;
        }
        return prevTime - 0.004;
      });
    }, 1);
    setTimerId(id);
    return () => clearInterval(id);
  }, []);

  // Reordered Questions
  let reorderedQuestions: string[];
  if (data.length > 0) {
    reorderedQuestions = numbers.map((number) => data[number - 1]);
  } else {
    reorderedQuestions = [];
  }

  // Handle Next Question
  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex >= reorderedQuestions.length) {
        setQuizFinished(true);
        return prevIndex;
      }
      setIsCorrectAnswer(null);
      setSelectedOption("");
      setTimerAdjustment(null); // Reset timer adjustment message for the next question
      return newIndex;
    });
  };

  // Update Timer
  const updateTimer = (seconds: number) => {
    setTimer((prevTime) => Math.min(prevTime + seconds, 60));
  };

  // Handle Answer
  const handleAnswer = (selectedOption: string) => {
    setSelectedOption(selectedOption);
    if (reorderedQuestions.length === 0) return;

    const currentQuestion = reorderedQuestions[currentQuestionIndex];
    const correctAnswer = currentQuestion.Answer;
    const level = currentQuestion.Level; // Get the difficulty level

    const isCorrect = selectedOption === correctAnswer;
    setIsCorrectAnswer(isCorrect);

    let adjustment = 0;
    if (isCorrect) {
      if (level === "easy") {
        adjustment = 4;
      } else if (level === "medium") {
        adjustment = 8;
      } else if (level === "hard") {
        adjustment = 12;
      }
    } else {
      if (level === "easy") {
        adjustment = -12;
      } else if (level === "medium") {
        adjustment = -8;
      } else if (level === "hard") {
        adjustment = -4;
      }
    }

    setTimerAdjustment(adjustment);
    updateTimer(adjustment);

    // Save User Answers
    setUserAnswers((prev) => [
      ...prev,
      {
        questionIndex: currentQuestionIndex,
        question: reorderedQuestions[currentQuestionIndex].Question,
        userAnswer: `(${selectedOption}) ${
          reorderedQuestions[currentQuestionIndex][`Option_${selectedOption}`]
        }`,
        correctAnswer: `(${correctAnswer}) ${
          reorderedQuestions[currentQuestionIndex][`Option_${correctAnswer}`]
        }`,
        explanation: reorderedQuestions[currentQuestionIndex].Explanation,
      },
    ]);

    setTimeout(handleNextQuestion, 500);
  };

  // Capitalize First Letter
  const capitalizeFirstLetter = (word: string) => {
    if (word.length === 0) return "";
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  // Current Question
  const question = reorderedQuestions[currentQuestionIndex];

  if (quizFinished) {
    return (
      <div className="max-h-[80vh] overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Finished</CardTitle>
            <CardDescription>Time&apos;s up</CardDescription>
          </CardHeader>
        </Card>

        {userAnswers.map((answer, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>
                Question {answer.questionIndex + 1}: {answer.question}
              </CardTitle>
              <CardDescription
                className={`${
                  answer.userAnswer === answer.correctAnswer
                    ? "text-green-500"
                    : "text-red-500"
                }  font-cofo-medium`}
              >
                Your Answer: {answer.userAnswer}
              </CardDescription>
              <CardDescription
                className={`${
                  answer.userAnswer === answer.correctAnswer ? "hidden" : "flex"
                }`}
              >
                Correct Answer: {answer.correctAnswer}
              </CardDescription>
            </CardHeader>
            <CardContent>{answer.explanation}</CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!question) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      {/* Time Bar */}
      <div className="w-full h-5 border-[2px] rounded-full relative">
        <div
          className={`bg-primary h-4 rounded-full mt-[0.5px]`}
          style={{ width: `${(timer / 60) * 100}%` }}
        />
        {timerAdjustment !== null && (
          <div
            className={`${
              timerAdjustment > 0 ? "text-green-500" : "text-red-500"
            } font-cofo-bold absolute`}
            style={{
              left: `${(timer / 60) * 100}%`,
              transform: "translateX(-100%)",
              top: "120%",
            }}
          >
            {timerAdjustment > 0 ? `+${timerAdjustment}` : timerAdjustment}
          </div>
        )}
      </div>
      <div
        className={`font-cofo-bold ${
          question.Level === "easy" ? "text-green-500" : "text-yellow-500"
        }`}
      >
        {capitalizeFirstLetter(question.Level)}
      </div>
      <div>{question.Question}</div>
      <div className="flex flex-col space-y-4">
        {["a", "b", "c", "d"].map((v) => (
          <Button
            key={v}
            className={`${
              selectedOption === v
                ? isCorrectAnswer === true
                  ? "bg-green-500 hover:bg-green-500 text-white"
                  : "bg-red-500 hover:bg-red-500 text-white"
                : "bg-secondary text-primary hover:bg-secondary"
            }`}
            onClick={() => handleAnswer(v)}
          >
            {question[`Option_${v}`]}
          </Button>
        ))}
      </div>
    </div>
  );
}
