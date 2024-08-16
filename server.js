const express = require("express")
const http = require("http")
const dotenv = require("dotenv").config()
const cors = require("cors")
const path = require("path")
const fs = require("fs")
const nodemailer = require("nodemailer")
const uuid = require("uuid")
const multer = require("multer")


const CorsOptions = require("./Config/CorsOptions.js")
const Connection = require("./Utils/Connection.js")


const AuthRouter = require("./Router/AuthRouter.js")
const UserRouter = require("./Router/UserRouter.js")



const app = express()
Connection()
const server = http.createServer(app)

app.use(cors(CorsOptions))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const transporter =  nodemailer.createTransport({
	service : "gmail",
	auth : {
		user : process.env.EMAIL,
		pass : process.env.PASSWORD
	}
})

app.use("/api/auth", AuthRouter)
app.use("/api/user", UserRouter)
app.post("/api/mail", async (req,res)=>{
	try {
		const {from,text} = req.body
		const language = req.headers["accept-language"]

		if(from && text){
			const mailOptions = {
				from : process.env.EMAIL,
				to : "edoghazaryan7@gmail.com",
				subject : from,
				text : text
			}
			console.log(mailOptions);
	
			await transporter.sendMail(mailOptions)
	
			if(language){
				if(language === "am"){
					res.status(201).send({message:"Ձեր նամակը հաջողությամ ուղարկվել է ձեզ հետ կապ կհաստատեն նշված էլէկտրոնային հասցեով", 								success:true})
				
				}
				if(language === "ru"){
					res.status(201).send({message:"Ваше электронное письмо было успешно отправлено, и с вами свяжутся по указанному адресу электронной 	`					почты.", success:true})
				}
				if(language === "en"){
					res.status(201).send({message:"Your email has been successfully sent, and you will be contacted at the email address you 								provided.", 	success:true})
				}
			}else{
				res.status(201).send({message:"Your email has been successfully sent, and you will be contacted at the email address you 								provided.", 	success:true})
			}
		}

	} catch (error) {
		console.error(error)
		res.status(500).send("Internal Server Error")
	}
	
})



// ---------------------voice start

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
	  cb(null, uuid.v4() + path.extname(file.originalname));
	},
  });
  
  const upload = multer({ storage });
  
  // Ensure the uploads directory exists
  if (!fs.existsSync('uploads')) {
	fs.mkdirSync('uploads');
  }
  
  // Route to handle audio uploads
  app.post('/upload-audio', upload.single('audio'), (req, res) => {
	if (req.file) {
	  res.json({ filePath: `uploads/${req.file.filename}` });
	} else {
	  res.status(400).json({ error: 'File upload failed' });
	}
  });







// ------------------------voice end



function getRandomRoomName(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let roomName = '';
    
    for (let i = 0; i < length; i++) {
        roomName += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return roomName;
  }




const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: [ "GET", "POST" ]
	}
})

const users = {}
let all_connected_users = []
let newRoomConnect = []

io.on("connection", (socket) => {
	if (!users[socket.id]) {
		users[socket.id] = socket.id;
	}
	console.log("connected", socket.id);
	socket.emit("me", socket.id)
	
	
	
	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit('hey', {from: data.from,roomId:data.roomId});
	})
	socket.on('disconnect', () => {	  
		delete users[socket.id];
		
		console.log(socket.id);
		io.sockets.emit("available_users", users);
	  })


	socket.on("join", (payload,) => {
		let roomId = getRandomRoomName()
		let roomClients 
		let numberOfClients 
		userName_cookie = payload.socketID
		console.log("join-----",payload);
		const findChat = newRoomConnect.find((chat)=> chat.roomMembers.includes(payload.socketID) && chat.roomMembers.includes(payload.participant))

		if(findChat){
			roomId = findChat.roomId
			socket.join(findChat.roomId)
			all_connected_users.map((r) => {
			if (r.room_id === findChat.roomId) {
				r.room_members.push(socket.id)
			}
		})
			socket.emit('room_joined', {
				roomId: findChat.roomId,
				peerId: socket.id,
				all_users: all_connected_users
			})
			console.log("join------", all_connected_users);
		
		

		}else{
			newRoomConnect.push({
				roomId,
				roomMembers : [payload.socketID, payload.participant]
			})


				 roomClients = io.sockets.adapter.rooms.get(roomId) || { size: 0 }
				 numberOfClients = roomClients.size

			socket.join(roomId)
			console.log(`Creating room ${roomId} and emitting room_created socket event`)
			all_connected_users.push({
				room_id: roomId,
				room_members: [userName_cookie]
			})
			socket.emit('room_created', {
				roomId: roomId,
				peerId: socket.id,
				all_users: all_connected_users
			})
		}
		

		socket.on('message', (message) => {
			console.log("message---",message);
			io.to(roomId).emit('createMessage', {message, from:message.from,userId:message.userId});
		});
		
		socket.on('image_upload', (data) => {
			const buffer = Buffer.from(data.image, 'base64');
			console.log("bufer---",buffer);
			const fileName = `${Date.now()}.jpg`;
			const filePath = path.join(__dirname, 'uploads', fileName);
			fs.writeFile(filePath, buffer, (err) => {
			  if (err) {
				console.error(err);
			  } else {
				
			  }
			});
			const imageUrl = `/uploads/${fileName}`;
			io.to(roomId).emit('receive_image', { imageUrl,userId:data.userId});
		  });
		socket.on('end_chat',(info)=>{
			all_connected_users = all_connected_users.filter((r)=> r.room_id !== info.roomId)
			socket.to(roomId).emit("end_chat",{})
		})

		// if (numberOfClients === 0) {
		// 	socket.join(roomId)
		// 	console.log(`Creating room ${roomId} and emitting room_created socket event`)
		// 	all_connected_users.push({
		// 		room_id: roomId,
		// 		room_members: [userName_cookie]
		// 	})
		// 	socket.emit('room_created', {
		// 		roomId: roomId,
		// 		peerId: socket.id,
		// 		all_users: all_connected_users
		// 	})
		// } else {
		// 	console.log(`Joining room ${roomId} and emitting room_joined socket event`)
		// 	all_connected_users.map((r) => {
		// 		if (r.room_id === roomId) {
		// 			r.room_members.push(socket.id)
		// 		}
		// 	})
		// 	socket.join(roomId)
		// 	socket.emit('room_joined', {
		// 		roomId: roomId,
		// 		peerId: socket.id,
		// 		all_users: all_connected_users
		// 	})
		// 	console.log("join------", all_connected_users);
		// }


		// -----------voice socket start


		socket.on('send-audio', (data) => {
			// Save the audio data to a file
			const audioBuffer = Buffer.from(new Uint8Array(data.filePath));
			const fileName = `${uuid.v4()}.webm`;
			const filePath = path.join('uploads', fileName);
		
			fs.writeFile(filePath, audioBuffer, (err) => {
			  if (err) {
				console.error('Error saving audio file:', err);
			  } else {
				// Broadcast the file path to other clients
				socket.broadcast.emit('receive-audio', data);``
			  }
			});
		  });
		

		// ------------voice socket end

	})

})

const PORT = process.env.PORT || 2000


server.listen(PORT, () => console.log(`server is running on ${PORT}`))