const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(undefined,{
    host:'/',
    port:'3001'
});

const myVideo = document.createElement('video');
myVideo.muted = true;

const peers = {};

navigator.mediaDevices.getUserMedia({
    audio:true,
    video:true
}).then((stream) => {
    console.log("Gaurav:::,Asked permission for audio and video and its allowed");
    console.log("Gaurav:::,stream",stream);

    addVideoStream(myVideo,stream);

    myPeer.on('call', call => {
        console.log("Gaurav:::CAll triggered");
        call.answer(stream);
        console.log("Gaurav:::CAll aswered");
            const video = document.createElement('video');
            call.on('stream',userVideoStream => {
                console.log("Gaurav:::CAll answered Showing Video",userVideoStream);
                addVideoStream(video,userVideoStream);
            });
    });

    socket.on('user-connected',(userId,roomId)=>{
        console.log("Gaurav:::User Connected " +userId +" connected to " + roomId);
        connectToNewUser(userId,stream);
    });
    
})
.catch((err) => {
    console.log("Gaurav::::err",err);
})

myPeer.on('open',(id)=>{
    console.log("Gaurav::: Peer Connection Open UserId",id);
    socket.emit('join-room',ROOM_ID,id);
    console.log("Gaurav::: Peer Connection Open : Asked for joining the room ",ROOM_ID , " With User Id " ,id);
})

socket.on('user-disconnected',userId => {
    console.log("Gaurav:::  user disconnected",userId);
    console.log("User disconnected", userId);
    if(peers[userId]) peers[userId].close();
})

document.getElementById('conn-button').addEventListener('click',() => {
    peer_id = document.getElementById('connId').value;
    if(peer_id){
        conn = myPeer.connect(peer_id);
    }else{

    }
});
function addVideoStream(video,stream){
    console.log("Gaurav:::,addVideoStream Started video showing",video, stream);
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',() => {
        console.log("Gaurav:::,addVideoStream Started video showing Video loaded now triied event loadedmetadata");
        video.play();
    });
    videoGrid.append(video);
}

function connectToNewUser(userId,stream){
    console.log("Gaurav:::Trying to connect to new user with User ID ",userId);
    const call = myPeer.call(userId,stream);
    console.log("Gaurav:::Trying to Call to new user with User ID ",userId);
    
    const video = document.createElement('video');
    call.on('stream',userVideoStream => {
        console.log("Gaurav:::Call coonected sending the video");     
        addVideoStream(video,userVideoStream)
    });
    call.on('close',() => {
        console.log("Gaurav:::Call discoonected");
        video.remove()
    });

    peers[userId] = call;
}