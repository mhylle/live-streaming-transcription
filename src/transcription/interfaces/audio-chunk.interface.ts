export interface AudioChunk {
  data: Uint8Array;
  sampleRate: number;
  channels: number;
  timestamp: number;
}