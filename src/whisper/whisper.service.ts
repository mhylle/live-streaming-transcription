import { Injectable, OnModuleInit } from '@nestjs/common';
import * as WhisperNode from 'whisper-node';

@Injectable()
export class WhisperService implements OnModuleInit {
  private whisper: any;

  async onModuleInit() {
    // Initialize Whisper with the base model
    this.whisper = new WhisperNode({
      modelName: 'tiny',  // Using tiny model for faster processing
      whisperOptions: {
        language: 'en',
      },
    });
  }

  async transcribe(audioBuffer: Buffer): Promise<string> {
    try {
      // Write buffer to temporary file (whisper-node requires file input)
      const tempFile = `temp_${Date.now()}.wav`;
      require('fs').writeFileSync(tempFile, audioBuffer);

      // Transcribe the audio
      const result = await this.whisper.transcribe(tempFile);

      // Clean up temporary file
      require('fs').unlinkSync(tempFile);

      return result.text;
    } catch (error) {
      console.error('Whisper transcription error:', error);
      throw error;
    }
  }
}