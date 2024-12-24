import { Module } from '@nestjs/common';
import { WhisperService } from './whisper.service';

@Module({
  providers: [WhisperService],
  exports: [WhisperService],
})
export class WhisperModule {}