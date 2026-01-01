import prisma from "../config/dbConfig.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const signupUserService = async({name,password , email}) =>{
    try {
        let isExist = await prisma.user.findUnique({
            where:{
                email
            }
        });
        if(isExist){
            throw new Error("User already exists");
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password,salt);

        const user = await prisma.user.create({
            data:{
                name,
                password:hashedPassword,
                email  
            }
        })
        const { password: _, ...safeUser } = user;
        return safeUser;
    } catch (error) {
        console.log(error);
        throw new Error(error.message)
    }
}

export const signinUserService = async({email,password}) =>{
    try {
        console.log("signin service called with ",email,password);
        if(!email || !password){
            throw new Error("Email and password are required");
        }
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        });
        if(!user){
            throw new Error("Invalid email or password");
        }
        const isPasswordValid = bcrypt.compareSync(password,user.password);
        if(!isPasswordValid){
            throw new Error("Invalid email or password");
        }
        const { password: _, ...safeUser } = user;
        const token = jwt.sign(
            {
                id:user.id,
                email:user.email
            }
            ,process.env.JWT_SECRET,
            {expiresIn:'10h'});
            safeUser.token = token;
        return safeUser; 
    } catch (error) {
        console.log(error);
        throw new Error(error.message)
    }
}