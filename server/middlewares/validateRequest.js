const validateRequest = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errorMessage = result.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
        }))

        const customError = new Error("Validation error")
        customError.statusCode = 400;
        customError.details = errorMessage;

        return next(customError);
    }

    req.body = result.data;
    next();
}

export default validateRequest;