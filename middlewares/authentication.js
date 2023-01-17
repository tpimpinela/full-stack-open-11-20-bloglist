const jwt = require("jsonwebtoken");

const authentication = (request, response, next) => {
  const authorization = request.get("authorization");
  if (!authorization || !authorization?.toLowerCase?.().startsWith?.("bearer"))
    return next();
  const token = authorization?.substring?.(7);
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (decodedToken.id) {
      request.token = decodedToken.id;
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authentication;
