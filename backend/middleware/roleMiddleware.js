// @ts-ignore
const authorize = (...allowedRoles) => {
  // @ts-ignore
  return (req, res, next) => {
    console.log("User role:", req.user.role);
    console.log("Allowed roles:", allowedRoles);
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }
    next();
  };
};

module.exports = { authorize };
