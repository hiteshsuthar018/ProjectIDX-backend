export const handleTerminalCreation = (ws, container) => {
    container.exec({
        Cmd: ['/bin/bash'],
        AttachStdin:true,
        AttachStdout:true,
        AttachStderr:true,
        Tty:true,
        User: 'sandbox',
    },(err,exec)=>{
         if(err){
            console.log("error while creating exec");
            return;
         }
         exec.start({hijack:true},(err,stream)=>{
            if(err){
                console.log("Error while wunning exec");
                return;
            }
            // STEP1: stream proccessing
            proccessStreamOutput(stream,ws)
            // STEP2: stream writing
            ws.on("message",(data)=>{
                stream.write(data);
            })
         })
    })

}



function proccessStreamOutput(stream,ws){
    let nextDataType = null; //Stores the type of the next message
    let nextDataLength = null; //Stores the length of the next message
    let buffer = Buffer.from("");
    
    function proccessStreamData(data){
        //these is the helper function to process incoming data chuncks
        if(data){
            buffer = Buffer.concat([buffer,data]);
        }
        if(!nextDataType){
            //if the next data type is not known ,then we need to read the next 8 bytes to determine the type and length of the message
            if(buffer.length>=8){
                const header = bufferSlicer(8);
                nextDataType = header.readUint32BE(0); //the first 4 bytes represent the type of message
                //the next 4 bytes represent the length of the message
                nextDataLength = header.readUint32BE(4);
                proccessStreamData(); //Recurresively call the function to proccess the message
            }
        }
        else{
            if(buffer.length >=nextDataLength){
                const content = bufferSlicer(nextDataLength) //Slice the buffer to get the message content
                ws.send(content); //send the message to the client
                nextDataType = null //reset the type and length of the next message 
                nextDataLength=null
                proccessStreamData();
            }
        }

    }

    function bufferSlicer(end){
        //these function slices the buffer and returns the sliced buffer and the remaining buffer
        const output = buffer.slice(0,end); //header of the chunk
        buffer = Buffer.from(buffer.slice(end,buffer.length)); //remaing part of the chunck 
        return output;
    }
    stream.on("data",proccessStreamData);
}