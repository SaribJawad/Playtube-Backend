class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    // handling the statck trace of files error
    if (stack) {
      this.stack = stack;
    } else {
      //passed the instance in the stackTrace
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
