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
      {data && <p>USER : {data.logged_in_as}</p>}
      <div>
        <h3>Recent Innovations in Generative AI</h3>
        <p>
          Recent innovations in generative AI have made significant strides across various fields in the last six months. One of the key developments is the rise of multimodal AI systems, which can process both text and visual inputs. Models like GPT-4 and Google DeepMind’s Gemini have enhanced multimodal capabilities, allowing for richer interaction across different media types.
        </p>
        <p>
          In creative industries, AI tools such as Runway's Gen-2 enable text-to-video generation, revolutionizing filmmaking and content creation. Midjourney and Adobe Firefly are advancing AI-generated artwork, providing easy-to-use platforms for both professionals and hobbyists.
        </p>
        <p>
          Improvements in language models have also been notable. GPT-4, for instance, shows enhanced reasoning and comprehension abilities, making it more effective for tasks like coding and problem-solving. AI is also reshaping personalized content and marketing, with systems generating targeted ads and product designs tailored to user preferences.
        </p>
        <p>
          Additionally, AI in journalism and entertainment has grown, with models generating high-quality articles, scripts, and summaries. Meanwhile, ethical concerns around deepfakes, misinformation, and privacy have prompted discussions about regulation and responsible AI use. These innovations are transforming industries, offering new possibilities and raising important questions about the future of AI technology.
        </p>
        
        <h4>Technical Aspects</h4>
        <p>
          This project is built using a modern tech stack that includes React for the frontend, Django for the backend, and MySQL as the database. The frontend and backend are fully decoupled and communicate through HTTP calls. JWT is used for authentication to ensure secure access to the application. The application is containerized using Docker and managed with docker-compose. NGINX is used to serve the frontend, and the backend runs on port 3000 while the frontend runs on the standard HTTP port (80). The entire project is hosted on a single server and is accessible from any computer at any time.
        </p>
        <h4>References</h4>
        <ul>
          <li><a href="https://example.com/article1" target="_blank" rel="noopener noreferrer">Example Article 1</a></li>
          <li><a href="https://example.com/article2" target="_blank" rel="noopener noreferrer">Example Article 2</a></li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;