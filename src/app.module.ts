import { Module } from '@nestjs/common';
import { TranscriptionModule } from './transcription/transcription.module';
import { WhisperModule } from './whisper/whisper.module';

@Module({
  imports: [TranscriptionModule, WhisperModule],
})
export class AppModule {}