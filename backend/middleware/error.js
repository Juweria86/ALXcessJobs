import ErrorResponse from "../utils/errorResponse.js";

const errorHandler = (err, req, res, next) => {
    // Make a copy of the error object and retain the original message
    let error = { ...err };
    error.message = err.message;

    // Handle CastError (typically occurs in MongoDB when an invalid ObjectId is passed)
    if (err.name === "CastError") {
        const message = `Resource not found: ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Handle Mongoose duplicate key error (error code 11000)
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message, 400);
    }

    // Handle Mongoose validation error (missing/invalid fields in schema)
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => ' ' + val.message).join(',');  // Concatenate all error messages
        error = new ErrorResponse(message, 400);
    }

    // Send response with status code and error message
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server error"
    });
};

// Export the errorHandler function as the default export
export default errorHandler;
