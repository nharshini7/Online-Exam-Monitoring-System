import React, { useEffect, useState } from 'react';

const CheatLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/scores/cheating-logs'); // Update with the correct API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch cheating logs');
                }
                const data = await response.json();
                setLogs(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) {
        return <p style={{ padding: '20px', textAlign: 'center' }}>Loading...</p>;
    }

    if (error) {
        return <p style={{ padding: '20px', textAlign: 'center' }}>Error: {error}</p>;
    }

    if (logs.length === 0) {
        return <p style={{ padding: '20px', textAlign: 'center' }}>No cheats detected yet</p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Cheating Detection Logs</h2>
            <table style={{ width: '90%', borderCollapse: 'collapse', margin: '2rem' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Timestamp</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Username</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log._id} style={{ textAlign: 'center' }}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.timestamp}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.username}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.action}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CheatLog;
