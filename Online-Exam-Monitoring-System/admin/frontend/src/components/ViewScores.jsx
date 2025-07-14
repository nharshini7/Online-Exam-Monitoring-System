import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/axios';
import '../styles/ViewScores.css';

const ViewScores = () => {
    const [scores, setScores] = useState([]);
    const [error, setError] = useState(null);
    const { subject } = useAuth();

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/scores/subject/${subject}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch scores');
                }
                const data = await response.json();
                console.log(data)
                setScores(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchScores();
    }, [subject]);

    return (
        <div className="unique-view-scores">
            <h1>Scores for {subject}</h1>
            {error && <p className="unique-view-scores__error">{error}</p>}
            {!error && scores.length === 0 && <p className="unique-view-scores__message">No scores available.</p>}
            {!error && scores.length > 0 && (
                <table className="unique-view-scores__table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Username</th>
                            <th>Score</th>
                            <th>Exam ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score) => (
                            <tr key={score._id} className="unique-view-scores__row">
                                <td>{score.title}</td>
                                <td>{score.username}</td>
                                <td>{score.score}</td>
                                <td>{score.examID}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );    
};

export default ViewScores;