export const validateSchema = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((error) => error.message);
    return res.status(400).json({
      message: errors,
    });
  }

  next();
};
