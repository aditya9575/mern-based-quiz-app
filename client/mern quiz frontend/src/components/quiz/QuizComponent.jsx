import React, { useState, useEffect } from 'react';
import styles from './quiz.module.css';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { TypeAnimation } from 'react-type-animation';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const QuizComponent = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [timeLeft, setTimeLeft] = useState(240); // 4 minutes in seconds
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('https://mern-based-quiz-app.vercel.app/questions')
            .then(response => {
                setQuestions(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching questions:", error);
                setError("Unable to load questions. Please try again later.");
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let timer;
        if (quizStarted && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(prevTime => prevTime - 1), 1000);
        } else if (timeLeft === 0) {
            handleSubmitQuiz();
        }
        return () => clearTimeout(timer);
    }, [timeLeft, quizStarted]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleOptionChange = (questionIndex, option) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [questionIndex]: option
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitQuiz = () => {
        setQuizFinished(true);
        calculateResults();
    };

    const restartQuiz = () => {
        setQuizStarted(false);
        setQuizFinished(false);
        setSelectedOptions({});
        setCurrentQuestionIndex(0);
        setTimeLeft(180);
        setResults(null);
    };

    const calculateResults = () => {
        let correctAnswers = 0;
        let topicPerformance = {};
        let userAnswers = [];
        let incorrectTopics = {};

        questions.forEach((question, index) => {
            const selectedOption = selectedOptions[index];
            const correctOption = question.options.find(option => option.isCorrect)?.optionText;

            userAnswers.push({
                question: question.text,
                selectedOption: selectedOption || "No answer selected",
                correctOption: correctOption || "No correct answer provided",
            });

            if (selectedOption === correctOption) {
                correctAnswers++;
                question.topics.forEach(topic => {
                    topicPerformance[topic] = (topicPerformance[topic] || 0) + 1;
                });
            } else {
                question.topics.forEach(topic => {
                    incorrectTopics[topic] = (incorrectTopics[topic] || 0) + 1;
                });
            }
        });

        setResults({
            total: questions.length,
            correct: correctAnswers,
            topicPerformance,
            incorrectTopics,
            userAnswers
        });
    };

    const getSuggestions = () => {
        if (!results) return null;

        const accuracy = (results.correct / results.total) * 100;
        const weakTopics = Object.keys(results.incorrectTopics)
            .filter(topic => results.incorrectTopics[topic] > 0)
            .join(", ");

        let suggestion = "Suggestions:\n";
        if (accuracy >= 80) suggestion += "Excellent work! You're well-prepared.";
        else if (accuracy >= 50) suggestion += "Good effort! Focus on the following topics: ";
        else suggestion += "Consider revising the basics. Pay special attention to the following topics: ";

        suggestion += weakTopics || "None (Great job!).";
        return suggestion;
    };

    const getChartData = () => {
        const topics = Object.keys(results?.topicPerformance || {});
        return {
            labels: topics,
            datasets: [
                {
                    label: 'Number of Correct Answers',
                    data: topics.map(topic => results.topicPerformance[topic]),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }
            ]
        };
    };

    const renderQuiz = () => {
        const question = questions[currentQuestionIndex];
        return (
            <div className={styles.quizBox}>
                <div className={styles.timer}>Time Left: {formatTime(timeLeft)}</div>
                <div className={styles.question}>
                    <h3>{question.text}</h3>
                    <div className={styles.options}>
                        {question.options.map((option, index) => (
                            <label key={index} className={styles.option}>
                                <input
                                    type="radio"
                                    name={`question-${currentQuestionIndex}`}
                                    value={option.optionText}
                                    checked={selectedOptions[currentQuestionIndex] === option.optionText}
                                    onChange={() => handleOptionChange(currentQuestionIndex, option.optionText)}
                                />
                                {option.optionText}
                            </label>
                        ))}
                    </div>
                    <div className={styles.navigation}>
                        <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                            Previous
                        </button>
                        <button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderResults = () => {
        return (
            <div className={styles.results}>
                <h2>Quiz Results</h2>
                <p>Score: {((results.correct / results.total) * 100).toFixed(2)}%</p>
                <h3>Suggestions:</h3>
                <p>{getSuggestions()}</p>
                <table className={styles.resultsTable}>
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Correct Answer</th>
                            <th>Your Answer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.userAnswers.map((answer, index) => (
                            <tr key={index}>
                                <td>{answer.question}</td>
                                <td>{answer.correctOption}</td>
                                <td>{answer.selectedOption}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Bar
                    data={getChartData()}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { display: true, position: 'top' },
                            title: { display: true, text: 'Performance by Topic' }
                        },
                        scales: {
                            x: { title: { display: true, text: 'Topics' } },
                            y: { title: { display: true, text: 'Correct Answers' } },
                        }
                    }}
                />
                <button onClick={restartQuiz} className={styles.restartButton}>
                    Retry
                </button>
            </div>
        );
    };

    return (
        <div className={styles.quizContainer}>
            {quizStarted ? (
                quizFinished ? (
                    renderResults()
                ) : (
                    renderQuiz()
                )
            ) : (
                <>
                    <TypeAnimation
                        sequence={[
                            `Welcome ${localStorage.getItem('name') || 'User'}!`,
                            1000,
                            "Let's revise with Quizzy!",
                            1000,
                        ]}
                        wrapper="h1"
                        cursor
                        repeat={Infinity}
                        className={styles.animationText}
                    />
                    <p>
                        Quizzy is your ultimate learning companion! Dive into a world of interactive quizzes
                        tailored to your interests. Test your knowledge, challenge yourself, and track your progress.
                        With personalized learning and engaging quizzes, Quizzy makes learning fun and effective.
                        Join us today and embark on a journey of discovery!
                    </p>
                    <button onClick={() => setQuizStarted(true)} className={styles.startButton}>
                        Start Quiz
                    </button>
                </>
            )
            }
            {
                quizStarted && !quizFinished && (
                    <button onClick={handleSubmitQuiz} className={styles.submitButton}>
                        Submit Quiz
                    </button>
                )
            }
        </div>

    );
};

export default QuizComponent;


// ----------------------------------------------------------
