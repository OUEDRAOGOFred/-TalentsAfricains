const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Privilèges administrateur requis.'
    });
  }
  next();
};

module.exports = { isAdmin };
