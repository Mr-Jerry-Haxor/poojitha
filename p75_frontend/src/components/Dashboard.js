import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        return;
      }
      try {
        const response = await axios.get('http://localhost:8000/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (error) {
        setError('Failed to fetch data');
        console.error('Error fetching dashboard data', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && <p>{data.logged_in_as}</p>}
    </div>
  );
}

export default Dashboard;