from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'generated_videos'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Placeholder function for video generation
def generate_video(text_prompt, duration):
    # This is where you'd integrate your AI model to generate the video
    # For now, we just return a placeholder path
    video_filename = "example_video.mp4"
    video_path = os.path.join(UPLOAD_FOLDER, video_filename)
    # Generate video and save it to video_path (placeholder logic)
    return video_path

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/generate_video', methods=['POST'])
def generate_video_endpoint():
    data = request.json
    if not data or 'text_prompt' not in data or 'duration' not in data:
        return jsonify({'error': 'Invalid request, missing text_prompt or duration'}), 400
    
    text_prompt = data['text_prompt']
    duration = data['duration']
    
    video_path = generate_video(text_prompt, duration)
    
    # Assuming the video generation is successful
    if os.path.exists(video_path):
        return jsonify({'status': 'success', 'video_path': video_path})
    else:
        return jsonify({'status': 'failure', 'error': 'Video generation failed'}), 500

if __name__ == '__main__':
    app.run(debug=True)

    from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/test')
def test_endpoint():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == '__main__':
    app.run(debug=True)

