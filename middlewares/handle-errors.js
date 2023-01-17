const handleErrors = (error, request, response, next) => {
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.code === 11000) {
    return response.status(400).json({
      error: `Value of field ${Object.keys(error.keyValue)} is already used.`,
    });
  } else if (error.name.toLowerCase().includes("token")) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  return response.status(500).end();
};

module.exports = handleErrors;
