export interface AccountStatus {
  subscriptionPlan: string;
  subscriptionState: string;
  credits: number;
}

export interface VectorizeResult {
  content: string;
  format: OutputFormat;
  creditsCharged: number;
  creditsCalculated: number;
}

export interface Credentials {
  apiId: string;
  apiSecret: string;
}

export type ProcessingMode = 'production' | 'preview' | 'test' | 'test_preview';

export type OutputFormat = 'svg' | 'eps' | 'pdf' | 'dxf' | 'png';

export interface VectorizeOptions {
  mode: ProcessingMode;
  outputFormat: OutputFormat;
}
