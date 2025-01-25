export class NotFoundError extends Error {
    public statusCode: number;
  
    constructor(message: string) {
      super(message);
      this.name = "NotFoundError";
      this.statusCode = 404;
    }
  }
  
  export class InternalServerError extends Error {
    public statusCode: number;
  
    constructor(message: string) {
      super(message);
      this.name = "InternalServerError";
      this.statusCode = 500;
    }
  }

  export class UnauthorizedError extends Error {
    public statusCode: number;
  
    constructor(message: string) {
      super(message);
      this.name = "UnauthorizedError";
      this.statusCode = 401;
    }
  }

  export class BadRequestError extends Error {
    public statusCode: number;
  
    constructor(message: string) {
      super(message);
      this.name = "BadRequestError";
      this.statusCode = 400;
    }
  }