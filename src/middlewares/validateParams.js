export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);

  if (!result.success) {
    const errors = result.error.issues.map((error) => error.message);

    return res.status(400).json({
      message: errors,
    });
  }

  req.params = result.data;

  next();
};
