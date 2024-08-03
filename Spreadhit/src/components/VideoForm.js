import React, { useState } from 'react';
import axios from 'axios';

function VideoForm() {
  const [textPrompt, setTextPrompt] = useState('');
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/generate_video', {
        text_prompt: textPrompt,
        duration: duration
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error generating video:', error);
    }
  };

  return (
    <div className="video-form">
      <form onSubmit={handleSubmit}>
        <label>
          Text Prompt:
          <input
            type="text"
            value={textPrompt}
            onChange={(e) => setTextPrompt(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Duration (seconds):
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Generate Video</button>
      </form>
      {result && (
        <div className="result">
          {result.status === 'success' ? (
            <p>Video generated successfully! <a href={result.video_path} target="_blank" rel="noopener noreferrer">Download Video</a></p>
          ) : (
            <p>Error: {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoForm;
