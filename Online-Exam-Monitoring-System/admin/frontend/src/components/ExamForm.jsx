import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios.js';
import { useAuth } from '../context/AuthContext';
import '../styles/ExamForm.css';

const ExamForm = ({ onExamCreated }) => { // Receive subject as a prop
  const { auth, subject } = useAuth();
  const navigate = useNavigate();
  // const [subject, setSubject] = useState('');
  const [title, setTitle] = useState(''); // Exam title
  const [date, setDate] = useState(''); // Exam date
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], answer: '', error: '' }
  ]);

  // useEffect(() => {
  //   const decodedToken = JSON.parse(atob(auth.split('.')[1]));
  //   setSubject(decodedToken.subject);
  // }, [auth]);

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      if (field === 'question') {
        updatedQuestions[index].question = value;
      } else if (field.startsWith('option')) {
        const optionIndex = parseInt(field.split('option')[1], 10);
        updatedQuestions[index].options[optionIndex] = value;
        // Check for duplicate options
        const uniqueOptions = new Set(updatedQuestions[index].options);
        updatedQuestions[index].error = uniqueOptions.size !== updatedQuestions[index].options.length ? 'Options must be unique' : '';
      } else if (field === 'answer') {
        updatedQuestions[index].answer = value;
      }
      return updatedQuestions;
    });
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '', error: '' }]);
  };

  const removeQuestion = (index) => {
    setQuestions((prevQuestions) => prevQuestions.filter((_, i) => i !== index));
  };

  const increaseOptions = (index) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      if (updatedQuestions[index].options.length < 10) {
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          options: [...updatedQuestions[index].options, '']
        };
      }
      return updatedQuestions;
    });
  };

  const decreaseOptions = (index) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      if (updatedQuestions[index].options.length > 2) {
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          options: updatedQuestions[index].options.slice(0, -1)
        };
      }
      return updatedQuestions;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if options are unique
    const hasError = questions.some((q) => q.error);
    if (hasError) {
      alert('Please ensure all options are unique in each question.');
      return;
    }

    // Check if answers match any options
    const hasInvalidAnswers = questions.some(q => !q.options.includes(q.answer));
    if (hasInvalidAnswers) {
      alert('Each answer must match one of the options.');
      return;
    }

    const examData = {
      id: Date.now().toString(), // Unique ID for the exam
      title,
      date,
      subject,
      questions
    };

    try {
      const response = await axios.post('http://localhost:5001/api/exams/createExam', examData, {
        headers: { Authorization: `Bearer ${auth}` }
      });
      console.log(response.data.message);

      // Reset form fields
      setTitle('');
      setDate('');
      setQuestions([{ question: '', options: ['', '', '', ''], answer: '', error: '' }]);

      // Notify AdminDashboard to refresh the exams list
      if (onExamCreated) onExamCreated();
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.log('Failed to create exam:', error);
    }
  };

  return (
    <div className="examform-container">
      <h3 className="examform-heading">Create Exam for {subject}</h3>
      <form onSubmit={handleSubmit} className="examform-form">
        <input
          type="text"
          placeholder="Title of Exam"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="examform-input examform-title"
        />
        <input
          type="date"
          value={date}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setDate(e.target.value)}
          required
          className="examform-input examform-date"
        />
        {questions.map((question, index) => (
          <div key={index} className="examform-question-item">
            <input
              type="text"
              placeholder="Question"
              value={question.question}
              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
              required
              className="examform-input examform-question"
            />
            {question.options.map((option, optIndex) => (
              <input
                key={optIndex}
                type="text"
                placeholder={`Option ${optIndex + 1}`}
                value={option}
                onChange={(e) => handleQuestionChange(index, `option${optIndex}`, e.target.value)}
                required
                className="examform-input examform-option"
              />
            ))}
            {question.error && <p className="examform-error-message">{question.error}</p>}
            <button type="button" onClick={() => increaseOptions(index)} className="examform-option-button">
              Increase Options
            </button>
            <button type="button" onClick={() => decreaseOptions(index)} className="examform-option-button">
              Decrease Options
            </button>
            <input
              type="text"
              placeholder="Answer"
              value={question.answer}
              onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
              required
              className="examform-input examform-answer"
            />
            <button type="button" onClick={() => removeQuestion(index)} className="examform-remove-button">
              Remove Question
            </button>
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="examform-add-question-button">
          Add Question
        </button>
        <button type="submit" className="examform-submit-button">Create Exam</button>
      </form>
    </div>
  );
};

export default ExamForm;
