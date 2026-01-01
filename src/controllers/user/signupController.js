import { signupUserService } from "../../service/authService.js";


export const signupUserController = async(req, res) => {
    try {
        const data = req.body;
        const user = await signupUserService(data);
        console.log(user);
        res.status(200).json({
            message:"user created successfully",
            data:user
        })
    } catch (error) {
        console.log("error from controller while creating user ",error);
        res.status(500).json({
            error:error.message
        })
    }
}