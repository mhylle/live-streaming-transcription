import { Injectable } from '@nestjs/common';
import { WhisperService } from '../whisper/whisper.service';
import { AudioChunk } from './interfaces/audio-chunk.interface';
import * as wav from 'wav';
import { Readable } from 'stream';

@Injectable()
export class TranscriptionService {
  private readonly sessions: Map<string, {
    audioBuffer: Buffer[],
    partialTranscript: string
  }> = new Map();

  constructor(private readonly whisperService: WhisperService) {}

  initializeSession(clientId: string) {
    this.sessions.set(clientId, {
      audioBuffer: [],
      partialTranscript: ''
    });
  }

  async processAudioChunk(clientId: string, chunk: AudioChunk): Promise<string | null> {
    const session = this.sessions.get(clientId);
    if (!session) {
      throw new Error('Session not initialized');
    }

    // Add the new chunk to the buffer
    session.audioBuffer.push(Buffer.from(chunk.data));

    // Process if we have enough audio data (e.g., 5 seconds worth)
    if (this.shouldProcessBuffer(session.audioBuffer)) {
      const transcription = await this.transcribeBuffer(session.audioBuffer);
      if (transcription && transcription !== session.partialTranscript) {
        session.partialTranscript = transcription;
        return transcription;
      }
    }

    return null;
  }

  private shouldProcessBuffer(buffer: Buffer[]): boolean {
    // Assuming 16kHz sample rate, 16-bit audio
    const totalBytes = buffer.reduce((acc, chunk) => acc + chunk.length, 0);
    const secondsOfAudio = totalBytes / (16000 * 2);
    return secondsOfAudio >= 5;
  }

  private async transcribeBuffer(audioBuffer: Buffer[]): Promise<string> {
    // Combine all chunks into a single buffer
    const combinedBuffer = Buffer.concat(audioBuffer);
    
    // Create a WAV file in memory
    const writer = new wav.Writer({
      channels: 1,
      sampleRate: 16000,
      bitDepth: 16
    });

    // Write audio data
    const audioStream = new Readable();
    audioStream.push(combinedBuffer);
    audioStream.push(null);
    audioStream.pipe(writer);

    // Get WAV buffer
    const wavBuffer = await new Promise<Buffer>((resolve) => {
      const chunks: Buffer[] = [];
      writer.on('data', chunk => chunks.push(chunk));
      writer.on('end', () => resolve(Buffer.concat(chunks)));
    });

    // Send to Whisper service
    return this.whisperService.transcribe(wavBuffer);
  }

  async finalizeTranascription(clientId: string): Promise<string | null> {
    const session = this.sessions.get(clientId);
    if (!session) {
      return null;
    }

    // Process any remaining audio
    if (session.audioBuffer.length > 0) {
      const transcription = await this.transcribeBuffer(session.audioBuffer);
      this.cleanupSession(clientId);
      return transcription;
    }

    return null;
  }

  cleanupSession(clientId: string) {
    this.sessions.delete(clientId);
  }
}