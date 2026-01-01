import prisma from "../config/dbConfig.js"


export const addCollabraterService = async(email,projectId) =>{
    try {
        console.log("adding collabrater with email :",email," to project id :",projectId);
        const user = await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        console.log("found user :",user);
        if(!user){
            throw new Error("User not found");
        }
        const existingCollabrater = await prisma.collabrater.findFirst({
            where:{
                projectId:projectId,
                userId:user.id
            }
        })
        if(existingCollabrater){
            throw new Error("Collabrater already exists");
        }
        const collabrater = await prisma.collabrater.create({
            data:{
                projectId,
                userId:user.id
            }
        })
        console.log("created collabrater :",collabrater);
        return collabrater;
    } catch (error) {
        console.error("Error in addCollabraterService:", error);
        throw new Error("Error while adding collabrater");
    }
}

export const getProjectCollabratersService = async(projectId) =>{
    try {
        console.log("fetching collabraters for project id :",projectId);
        const collabraters = await prisma.collabrater.findMany({
            where:{
                projectId:projectId
            },
            include:{
                user:true
            }
        })
        console.log("found collabraters :",collabraters);
        return collabraters;
    } catch (error) {
        console.error("Error in getProjectCollabratersService:", error);
        throw new Error("Error while fetching collabraters");
    }
}