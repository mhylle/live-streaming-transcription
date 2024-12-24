import { Module } from '@nestjs/common';
import { TranscriptionGateway } from './transcription.gateway';
import { TranscriptionService } from './transcription.service';
import { WhisperModule } from '../whisper/whisper.module';

@Module({
  imports: [WhisperModule],
  providers: [TranscriptionGateway, TranscriptionService],
})
export class TranscriptionModule {}