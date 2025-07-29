const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let error = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  };

  let statusCode = 500;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    error.error.code = 'VALIDATION_ERROR';
    error.error.message = err.message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    error.error.code = 'INVALID_ID';
    error.error.message = 'Invalid ID format';
  } else if (err.code === 'ENOENT') {
    statusCode = 500;
    error.error.code = 'FILE_NOT_FOUND';
    error.error.message = 'Data file not found';
  } else if (err.code === 'EACCES') {
    statusCode = 500;
    error.error.code = 'FILE_PERMISSION_ERROR';
    error.error.message = 'Permission denied accessing data file';
  } else if (err.message && err.message.includes('JSON')) {
    statusCode = 500;
    error.error.code = 'JSON_PARSE_ERROR';
    error.error.message = 'Error parsing data file';
  }

  // Include error details in development
  if (process.env.NODE_ENV === 'development') {
    error.error.stack = err.stack;
    error.error.details = err.message;
  }

  res.status(statusCode).json(error);
};

module.exports = errorHandler;