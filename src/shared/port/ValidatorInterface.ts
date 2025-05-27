export interface ValidatorInterface {
  validate(dto: object): Promise<void>;
  isValidationError(error: unknown): boolean;
  validationErrorToMessage(error: unknown): string;
}
