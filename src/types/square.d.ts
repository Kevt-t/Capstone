/**
 * Type definitions for Square Web Payments SDK
 */

interface SquarePaymentsCard {
  attach(cardEl: HTMLElement): Promise<void>;
  tokenize(): Promise<SquarePaymentsTokenizeResult>;
}

interface SquarePaymentsTokenizeResult {
  status: 'OK' | 'ERROR';
  token?: string;
  errors?: Array<{
    code: string;
    message: string;
    field?: string;
  }>;
}

interface SquarePayments {
  card(options: any): SquarePaymentsCard;
}

interface Window {
  squarePayments?: SquarePayments;
}
