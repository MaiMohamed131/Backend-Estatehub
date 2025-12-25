import ApiError from "../utils/ApiError.js";
// Middleware to validate request data (body, query, params) 
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      return next(new ApiError(400, messages));
    }
    req[property] = value;

    next();
  };
};

export default validate;
