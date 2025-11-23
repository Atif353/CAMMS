export const validateRequest = (schema) => {
  return (req, res, next) => {
    if (req.body.startDate === '') req.body.startDate = null;
    if (req.body.endDate === '') req.body.endDate = null;
    if (req.body.reportType === '') req.body.reportType = null;
    
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    req.body = value;
    next();
  };
};

