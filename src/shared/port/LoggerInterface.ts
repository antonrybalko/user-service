export interface LoggerInterface {
  error(message: unknown): void;
  info(message: string): void;
}
