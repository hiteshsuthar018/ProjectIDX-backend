import { execPromisified } from '../utils/execUtility.js';
import fs from "fs/promises";
import directoryTree from 'directory-tree';
import path from 'path';
import prisma from '../config/dbConfig.js';
import FindProjectCommand from '../utils/FindProjectCommand.js';
export const createProjectService = async (userId,projectType) => {
   // create and unique and create new folder inside project folder  with that id
   console.log("entered create project service");
       const user = await prisma.user.findUnique({
        where:{
            id:userId
        }
       })
         if(!user){ 
            throw new Error("User not found");
         }
         console.log("project type is  :",typeof(projectType));
        const project = await prisma.project.create({
            data:{
                userId:user.id,
                type:projectType
            }
        })
       const projectId = project.id;
       console.log("new project id :",projectId);
       await fs.mkdir(`./projects/${projectId}`);
       //after that call the npm create vite@latest inside current directory /projects/projectId
       const projectCommand = FindProjectCommand(projectType);
       await execPromisified(projectCommand,{
           cwd:`./projects/${projectId}`
       })
        return projectId;
}

export const getProjectTreeService = async(projectId) =>{
     const projectPath = path.resolve(`./projects/${projectId}`);
     const tree = await directoryTree(projectPath);
     return tree;
}

export const getAllProject = async(userId) =>{
    try{
        const projects = await prisma.project.findMany({
            where:{
                userId:userId
            }
        })
        return projects;
    }catch(err){
        throw new Error("Error while fetching projects");
    }
}   