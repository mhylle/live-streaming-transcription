import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodeWhisper from 'node-whisper';

@Injectable()
export class WhisperService implements OnModuleInit {
  private whisper: any;

  async onModuleInit() {
    // Initialize Whisper with the base model
    this.whisper = await nodeWhisper.init({
      modelName: 'base',
      whisperOptions: {
        strategy: 'faster-whisper',
      },
    });
  }

  async transcribe(audioBuffer: Buffer): Promise<string> {
    try {
      const result = await this.whisper.transcribe(audioBuffer, {
        language: 'en',
        task: 'transcribe',
        beamSize: 1, // Faster processing
        bestOf: 1,   // Faster processing
      });

      return result.text;
    } catch (error) {
      console.error('Whisper transcription error:', error);
      throw error;
    }
  }
}