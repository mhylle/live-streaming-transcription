# Live Streaming Audio Transcription

A real-time audio transcription system built with NestJS and Whisper, using WebSocket for streaming audio data.

## Features

- Real-time audio streaming
- Live transcription using Whisper
- WebSocket-based communication
- Browser-based audio recording
- Multi-client support
- Session management

## Prerequisites

- Node.js (>= 14.x)
- npm or yarn
- Modern web browser with WebSocket support

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mhylle/live-streaming-transcription.git
cd live-streaming-transcription
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start:dev
```

4. Open the client application:
Navigate to `client/index.html` in your web browser

## Usage

1. Click the "Start Recording" button to begin audio capture
2. Speak into your microphone
3. The transcription will appear in real-time below the controls
4. Click "Stop Recording" when finished

## Architecture

The system consists of several components:
- WebSocket Gateway for real-time communication
- Transcription Service for audio processing
- Whisper Service for speech-to-text conversion
- Browser-based client for audio capture and streaming

## Technical Details

- Uses Socket.IO for WebSocket communication
- Processes audio in 5-second chunks for optimal performance
- Supports multiple concurrent users
- Implements proper cleanup and error handling

## Development

To run the tests:
```bash
npm test
```

To build for production:
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
