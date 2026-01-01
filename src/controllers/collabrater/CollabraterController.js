import { addCollabraterService, getProjectCollabratersService } from "../../service/collabraterService.js";

export const addCollabraterController = async(req,res) =>{
    try {
    const {projectId,email} = req.body;
    const collabrater = await addCollabraterService(email,projectId);
    return res.status(200).json({message:"collabrater added successfully",data:collabrater})
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export const getProjectCollabratersController = async(req,res) =>{
    try {
        const {projectId} = req.body;
       const collaborator = await getProjectCollabratersService(projectId);
        return res.status(200).json({message:"Collabraters fetched successfully",data:collaborator});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}