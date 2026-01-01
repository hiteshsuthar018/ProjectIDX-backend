import prisma from "../config/dbConfig.js";

const projectAccessMiddleware = async(req, res, next) => {
    const userId = req.user.id;
    const { projectId } = req.params; // Assuming projectId is passed as a URL parameter
  console.log("Verifying access for user id :",userId," to project id :",projectId);
    let hasAccess = await prisma.collabrater.findFirst({
        where: {
            projectId: projectId,
            userId: userId
        }
    });
     if(!hasAccess){
        hasAccess = await prisma.project.findFirst({
            where: {
                id: projectId,
                userId: userId
            }
        });
     }
    if (!hasAccess) {
        return res.status(403).json({ message: 'User does not have access to this project' });
    }
    next();
}
//socket.io
export const projectAccessMiddlewareForSocket = async (socket, next) => {
    console.log("socket.io : Verifying project access for socket...");

    const userId = socket.user.id;
    const projectId = socket.handshake.query.projectId;
    console.log("socket.io : Verifying socket access for user id :",userId," to project id :",projectId);
    if (!projectId) {
        return next(new Error("Project ID missing in socket query"));
    }

    console.log(`socket.io : Checking access: user=${userId}, project=${projectId}`);

    try {
        // Check if project exists
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            return next(new Error("Project not found"));
        }

        // Check if user is owner
        const isOwner = project.userId === userId;

        // Check if user is collaborator
        const isCollaborator = await prisma.collabrater.findFirst({
            where: {
                projectId,
                userId,
            },
        });

        if (!isOwner && !isCollaborator) {
            return next(new Error("User does not have access to this project"));
        }

        console.log("socket.io : Access granted to socket.");

        next();
    } catch (err) {
        console.log("Project access error:", err.message);
        return next(new Error("Project access check failed"));
    }
};


// ws socket
export const projectAccessMiddlewareForWs = async (ws, req) => {
    console.log("WS:Verifying project access for WebSocket...");
    const userId = ws.user.id;
    const projectId = req.url.split("=")[1];
     console.log("WS:Verifying WebSocket access for user id :",userId," to project id :",projectId);
    let hasAccess = await prisma.collabrater.findFirst({
        where: {
            projectId: projectId,
            userId: userId
        }
    });
     if(!hasAccess){
        hasAccess = await prisma.project.findFirst({
            where: {
                id: projectId,
                userId: userId
            }
        });
     }
    if (!hasAccess) {
        return false;
    }
    console.log("WS:Project access verified for WebSocket.",hasAccess);
    return true;
}

export default projectAccessMiddleware;