import prisma from "../config/dbConfig.js";

export const verifyProjectOwner = (req, res, next) => {
    const userId = req.user.id;
    const { projectId } = req.body;
    // Logic to verify if userId is the owner of projectId
    const isOwner = prisma.project.findFirst({
        where: {
            id: projectId,
            userId: userId
        }
    }) // Replace with actual verification logic
    
    if (!isOwner) {
        return res.status(403).json({ message: 'User is not the owner of the project' });
    }
    next();
}