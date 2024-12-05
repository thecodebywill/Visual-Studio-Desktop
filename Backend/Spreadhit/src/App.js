import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/test')  // Assuming your Flask API has an endpoint /api/test
      .then(response => response.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <div className="App">
      <h1>Spreadhit</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
//part 2
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Spreadhit</h1>
        <button>Sign In</button>
        <button>Sign Up</button>
      </header>
      <section>
        <h2>Sample Videos</h2>
        <div className="video-samples">
          <video width="320" height="240" controls>
            <source src="sample1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <video width="320" height="240" controls>
            <source src="sample2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
    </div>
  );
}

export default App;

