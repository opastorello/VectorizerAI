export interface AccountStatus {
  subscriptionPlan: string;
  subscriptionState: string;
  credits: number;
}

export interface VectorizeResult {
  content: string;
  contentType: string;
  isBase64: boolean;
  format: OutputFormat;
  creditsCharged: number;
  creditsCalculated: number;
}

export type ProcessingMode = 'production' | 'preview' | 'test' | 'test_preview';

export type OutputFormat = 'svg' | 'eps' | 'pdf' | 'dxf' | 'png';

export interface VectorizeOptions {
  mode: ProcessingMode;
  outputFormat: OutputFormat;
}
