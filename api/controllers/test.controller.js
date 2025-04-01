import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req, res) => {
  console.log(req.userId);
  res.status(200).json({
    message: "Authenticated",
  });
};

export const shouldBeAdmin = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Not Aunthenticated",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Token is not valid",
      });
    }
    if (!decoded.isAdmin) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }
  });

  res.status(200).json({
    message: "Authenticated",
  });
};
