function attach(app) {
  return (req, res, next) => {
    req.appContext = {
      self: app,
    };

    next();
  };
}

module.exports = {
  attach,
};