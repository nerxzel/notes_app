const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Server Internal Error";
    let details = err.details || null;

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        details
    });
};

export default errorHandler;