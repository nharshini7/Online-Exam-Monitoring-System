// ExamPopup.jsx
import React from 'react';
import '../styles/ExamPopup.css';

const ExamPopup = ({ exam, onClose }) => {
  if (!exam) return null; // Don't render if no exam is selected

  return (
    <div className="exam-popup-overlay">
      <div className="exam-popup">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>{exam.title}</h2>
        <p><strong>Subject:</strong> {exam.subject}</p>
        <p><strong>Date:</strong> {exam.date}</p>
        
        <div className="exam-questions">
          {exam.questions.map((question, index) => (
            <div key={index} className="exam-question">
              <p className="question-text">{question.question}</p>
              {question.options.map((option, i) => (
                <label key={i}>
                  <input type="radio" name={`question-${index}`} disabled />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamPopup;
