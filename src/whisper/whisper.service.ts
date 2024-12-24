import { Injectable, OnModuleInit } from '@nestjs/common';
import { pipeline } from '@xenova/transformers';

@Injectable()
export class WhisperService implements OnModuleInit {
  private transcriber: any;

  async onModuleInit() {
    // Initialize the transcriber with Whisper model
    this.transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {
      chunk_length_s: 30,         // Process 30 seconds of audio at a time
      stride_length_s: 5,         // Stride of 5 seconds for overlapping windows
      return_timestamps: true,    // Get word-level timestamps
      language: 'english',        // Force English language
    });
  }

  async transcribe(audioBuffer: Buffer): Promise<string> {
    try {
      // Convert audio buffer to Float32Array (assuming 16-bit audio)
      const float32Array = new Float32Array(audioBuffer.length / 2);
      for (let i = 0; i < float32Array.length; i++) {
        float32Array[i] = audioBuffer.readInt16LE(i * 2) / 32768.0;
      }

      // Transcribe the audio
      const result = await this.transcriber(float32Array, {
        sampling_rate: 16000,  // Must match the input audio sampling rate
      });

      return result.text;
    } catch (error) {
      console.error('Whisper transcription error:', error);
      throw error;
    }
  }
}