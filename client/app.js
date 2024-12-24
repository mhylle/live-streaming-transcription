const socket = io('http://localhost:3000');
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const transcriptionDiv = document.getElementById('transcription');

// WebSocket event handlers
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('transcription', (transcription) => {
    transcriptionDiv.textContent = transcription;
});

socket.on('error', (error) => {
    console.error('Server error:', error);
    alert('An error occurred during transcription');
});

// Recording functions
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
                // Convert blob to array buffer and send to server
                event.data.arrayBuffer().then(buffer => {
                    socket.emit('audioChunk', {
                        data: new Uint8Array(buffer),
                        sampleRate: 16000,
                        channels: 1,
                        timestamp: Date.now()
                    });
                });
            }
        };

        mediaRecorder.onstart = () => {
            audioChunks = [];
            socket.emit('startTranscription');
            isRecording = true;
            startBtn.disabled = true;
            stopBtn.disabled = false;
        };

        mediaRecorder.onstop = () => {
            socket.emit('endTranscription');
            isRecording = false;
            startBtn.disabled = false;
            stopBtn.disabled = true;
        };

        // Start recording
        mediaRecorder.start(1000); // Collect data every second
    } catch (error) {
        console.error('Error starting recording:', error);
        alert('Could not start recording: ' + error.message);
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
}

// Event listeners
startBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (isRecording) {
        stopRecording();
    }
    socket.disconnect();
});