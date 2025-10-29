import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation';
import './News.css';
import config from '../../config';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const CryptoNews = () => {
  const [news, setNews] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire({
      icon: 'error',
      title: 'Session Expired',
      text: 'Your login session expired, You need to log in again',
      confirmButtonColor: '#22c55e', // Tailwind green-500
    }).then(() => {
      navigate("/login"); // Redirect to login after closing the alert
    });
  }
}, [navigate]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${config.BACKEND_URL}/api/news`);
        const data = await response.json();
        setNews(data.articles || []); 
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen w-screen" style={{ width: "100vw" }}>
      <Navbar />

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-5 news-container px-5">
          {news.length > 0 ? (
            news.map((article, index) => (
              <div key={index} className="bg-gray-800 rounded shadow-lg p-4 news-card">
                {article.urlToImage && (
                  <img 
                  src={article.urlToImage || 'news.png'} 
                  alt={article.title} 
                  className="w-full h-auto rounded-t" 
                />
                )}
                <h2 className="text-xl font-semibold mt-2 text-gray-900" style={{color:"white"}}>{article.title}</h2>
                <p className="text-gray-700">{article.description}</p>
                <p className="text-gray-500 text-sm">Published at: {new Date(article.publishedAt).toLocaleString()}</p>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline"
                >
                  Read more
                </a>
              </div>
            ))
          ) : (
            <div className="text-center w-full text-gray-400">No news available.</div>
          )}
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default CryptoNews;
