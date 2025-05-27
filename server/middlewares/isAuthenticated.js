import jwt from 'jsonwebtoken';

const isAuthenticated=async (req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:"user is not authenticated",
                success:false
            })
        };
        const decode= await jwt.verify(token,process.env.SECRET_KEY)
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        }
        req.id=decode.userId
        next()
        
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "user is not logged in",
          });
    }
}
export default isAuthenticated;