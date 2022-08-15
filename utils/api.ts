function errorHandler(error: any): string {
  console.error(error);
  const errorMessage =
    error instanceof Error ? error.message : "Internal server error";
  return errorMessage;
}

export { errorHandler };
