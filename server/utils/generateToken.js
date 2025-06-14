import jwt from "jsonwebtoken"

export const generateToken=(res,user,message)=>{
    const token=jwt.sign({userId:user._id},process.env.SECRET_KEY,
        {expiresIn:'1d'}
    )
    return res.status(200).cookie("token", token, {
        httpOnly: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
      }).json({
        success: true,
        message: "Login successful",
        user: user.toObject(), // Ensure you send a plain object
      });
}