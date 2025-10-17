import jwt from "jsonwebtoken";

export const generateCookie = (res, user) => {
    const token = jwt.sign(
        { userId: user._id},
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        maxAge: 3600000 // 1 hour
    });
}