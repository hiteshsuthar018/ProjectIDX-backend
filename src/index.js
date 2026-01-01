import express from "express";
import cors from "cors";
import {createServer} from "node:http"
import { PORT } from "./config/envConfig.js";
import apiRouter from "./routes/index.js";
import {Server} from "socket.io";
import chokidar from "chokidar";
import { handleEditorSocketEvents } from "./socketHandlers/editorHandler.js";
import {  GetContainerPort, handleContainerCreate } from "./containers/handleContainerCreate.js";
import { WebSocketServer} from "ws";
import { handleTerminalCreation } from "./containers/handleTerminalCreation.js";
import { authMiddlewareForSocket, wsAuthMiddleware } from "./middleware/authMiddleware.js";
import { projectAccessMiddlewareForSocket, projectAccessMiddlewareForWs } from "./middleware/projectAccessMiddleware.js";
const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});


app.use(express.json());
app.use(express.urlencoded());
app.use(cors({  origin: "*"}));

//Rest apis
app.use('/api',apiRouter)



//editor socket connection using socket.io
const editornamespace = io.of('/editor');
editornamespace.use(authMiddlewareForSocket);
editornamespace.use(projectAccessMiddlewareForSocket);

editornamespace.on("connection",(socket)=>{
    console.log("editor connected")
    // somehow we will get the project Id from frontend;
    const projectId = socket.handshake.query['projectId'];
    
    if(projectId){
        var watcher = chokidar.watch(`./projects/${projectId}`,{
            ignored:(path)=>path.includes('node_modules') || path.includes('.git'),
            persistent:true, // keep the watcher in running state till the time app is running
            awaitWriteFinish:{
                stabilityThreshold:2000, //ensure stability of files before triggerting the event
            },
            ignoreInitial:true
        });
        watcher.on("all",(event,path)=>{
            console.log(path,event)
        })
    }

    //joining room with projectId+path
     socket.on("join_room", ({roomId}) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);

  
    socket.to(roomId).emit("user_joined", {
      userId: socket.id,
      roomId
    });
});

socket.on("getPort",async(conatinerId)=>{
    
    const port = await GetContainerPort(conatinerId);
    socket.emit("getPortSuccess",port);
 })

socket.on("leave_room", ({roomId}) => {
  socket.leave(roomId);
  console.log(`User ${socket.id} left room ${roomId}`);

  // Notify others
  socket.to(roomId).emit("user_left", {
    userId: socket.id,
    roomId
  });
});

handleEditorSocketEvents(socket,editornamespace)


   
    // socket.on("disconnect",async()=>{
    //     await watcher.close();
    //     console.log("editor  disconnected")
    // })
})


//raw socket connection for terminal
const webSocketForTerminal = new WebSocketServer({
     noServer: true //we will handle the upgrade event
 });



server.on("upgrade",async (req,tcpSocket,head)=>{
    /*
    * req: Incoming http request
    * socket: TCP socket
    * head: Buffer containing the first packet of the upgrade stream
    */
    
    //This callback will be called when a client tries to connect to the server through web socket

    const isTerminal = req.url.includes("/terminal");
    
    const wsAuth = await wsAuthMiddleware(webSocketForTerminal,req);
    if(!wsAuth){
        tcpSocket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        tcpSocket.destroy();
        return;
    }
   const projectAuth = await projectAccessMiddlewareForWs(webSocketForTerminal,req);
    if(!projectAuth){
        tcpSocket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
        tcpSocket.destroy();
        return;
    }
    if(isTerminal){
        console.log(req.url);
        const projectId = req.url.split("=")[1];
        console.log("Project Id for terminal :",projectId);
        const userId = webSocketForTerminal.user.id;
        await handleContainerCreate(userId,projectId,webSocketForTerminal,req,tcpSocket,head)
    }
})

webSocketForTerminal.on("connection",(ws,req,container)=>{
    handleTerminalCreation(ws,container);

    ws.on("close",()=>{
        console.log("terminal connection closed");
       container.remove({force:true},(err,data)=>{
           if(err){
            console.log("Error while removing container");
           }
           console.log("container remove successfully :",data);
       })
    })  
})


server.listen(PORT,'0.0.0.0',()=>{
    console.log(`Server started on port :${PORT}`)
})
