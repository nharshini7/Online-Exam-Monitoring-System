// src/components/QuestionsLog.jsx
import React, { useEffect, useState } from 'react';
import api from '../config/axios';
import ExamPopup from './ExamPopup';
import { useAuth } from '../context/AuthContext';
import '../styles/QuestionsLog.css';

const QuestionsLog = () => {
  const { auth } = useAuth();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    fetchExams();
  }, [auth]);

  const fetchExams = async () => {
    try {
      const response = await api.get('/api/exams/getExams', {
        headers: { Authorization: `Bearer ${auth}` }
      });
      setExams(response.data);
    } catch (error) {
      console.log('Error fetching exams:', error);
    }
  };

  const handleExamClick = (exam) => {
    setSelectedExam(exam);
  };

  const closePopup = () => {
    setSelectedExam(null);
  };

  return (
    <div className="questions-log-container">
      <h3 className="exams-title">Exams</h3>
      {exams.length > 0 ? (
        <ul className="exams-list">
          {exams.map((exam) => (
            <li 
              key={exam.id} 
              className="exam-item" 
              onClick={() => handleExamClick(exam)}
            >
              {exam.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>You have not created any exam.</p>
      )}
      {selectedExam && <ExamPopup exam={selectedExam} onClose={closePopup} />}
    </div>
  );
};

export default QuestionsLog;
