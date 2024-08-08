const Chats = require("../Model/Chats.js");
const User = require("../Model/User.js");



const UserService = {
    search: async (gender, maxAge, minAge,userId)=>{
        const allUser = await User.find({ _id: { $ne: userId } })
  
      
        const onlineUsers = allUser.filter((u)=> u.status === "online" && u._id !== userId)

        if(onlineUsers.length > 0){
           

            if(!gender && !maxAge && !minAge){
                let index = Math.floor(Math.random() * onlineUsers.length)
                return {status:200, user: onlineUsers[index]}
            }
            if(gender && !maxAge && !minAge){
                
                const findUserGender = onlineUsers.filter((u)=> u.gender === gender)
                let index = Math.floor(Math.random() * findUserGender.length)
              
                if(findUserGender.length > 0){
                    return {status: 200, user:findUserGender[index]}
                }else{
                    return{status: 404, message: "We didnt find any User With These parameters"}
                }
               
             
            }
            if(!gender && maxAge && !minAge){
                const findUserMax = onlineUsers.filter((u)=> u.age <= maxAge)
                let index = Math.floor(Math.random() * findUserMax.length)
                if(findUserMax.length > 0){
                    return {status: 200, user:findUserMax[index]}
                }else{
                    return{status: 404, message: "We didnt find any User With These parameters"}
                }
               
               
            
            }
            if(!gender && !maxAge && minAge){
                const findUserMin = onlineUsers.filter((u)=> u.age >= minAge)
                let index = Math.floor(Math.random() * findUserMin.length)
                if(findUserMin.length > 0){
                    return {status: 200, user:findUserMin[index]}
                }else{
                    return{status: 404, message: "We didnt find any User With These parameters"}
                }
              
               
            }
            if(gender && maxAge && !minAge){
                const findUseGenderMax = onlineUsers.filter((u)=> u.age <= maxAge && u.gender === gender)
                let index = Math.floor(Math.random() * findUseGenderMax.length)
                if(findUseGenderMax.length > 0){
                    return {status: 200, user:findUseGenderMax[index]}
                }else{
                    return{status: 404, message: "We didnt find any User With These parameters"}
                }
            
           
            }
            if(gender && !maxAge && minAge){
                const findUseGenderMin = onlineUsers.filter((u)=> u.age >= minAge && u.gender === gender)
                let index = Math.floor(Math.random() * findUseGenderMin.length)
                if(findUseGenderMin.length > 0){
                    return {status: 200, user:findUseGenderMin[index]}
                }else{
                    return{status: 404, message: "We didnt find any User With These parameters"}
                }
               
     
            }
            if(!gender && maxAge && minAge){
                const findUseMaxMin = onlineUsers.filter((u)=> u.age <= maxAge && u.age >= minAge)
                let index = Math.floor(Math.random() * findUseMaxMin.length)
                if(findUseMaxMin.length > 0){
                    return {status: 200, user:findUseMaxMin[index]}
                }else{
                    return{status: 404, message: "We didnt find any User With These parameters"}
                }
            
         
            }
            if(gender && maxAge && minAge){
                const findUseGenderMaxMin = onlineUsers.filter((u)=> u.age <= maxAge && u.gender === gender && u.age >= minAge) 
                let index = Math.floor(Math.random() * findUseGenderMaxMin.length)
                if(findUseGenderMaxMin.length > 0){
                    return {status: 200, user:findUseGenderMaxMin[index]}
                }else{
                    return{status: 404, message: "We didnt find any User With These parameters"}
                }
              
            }
            
          
                
            
          
        }else{
            return {status: 404, message: "There are currently no online users"}
        }
    },
    getUser: async(userId)=>{
        if(userId){
            const findUser = await User.findById(userId).populate("chats")

            if(findUser){
                return {status:200, user:findUser}
            }else{
                return {status: 404, message: "User Not Found"}
            }
        }else{
            return {status: 400, message:"Bad Request"}
        }
    },
    getNotification : async (language)=>{
        if(language){
            if(language === "am"){
                return {status:200 , message: "Փորձիր Քո Հաջողությունը"}
            }
            if(language === "en"){
                return {status:200 , message: "Try Your Luck"}
            }
            if(language === "ru"){
                return {status:200 , message: "Попробуй Свою Удачу"}
            }
        }else{
            return {status: 400, message:"Bad Request"}
        }
    },
    changeUser : async (userId,gender,age)=>{
       if(userId){
        if(!gender && !age){
            return {status: 400, message : "Bad Request"}
        }else{
            const findUser = await User.findById(userId)

            if(findUser){
                age ? findUser.age = age : ""
                gender ? findUser.gender = gender : ""

                await findUser.save()

                return {status:202 ,user: findUser}


                
            }else{
                return {status:404, message: "User Not Found"}
            }
        }
       }else{
        return {status:400, message: "Bad Request You must send userId"}
       }
    },
    addChat :async(roomId,chat,userId)=>{
        if(roomId,chat,userId){
            const user = await User.findById(userId)
            if(user){
                const createdAt = new Date().toLocaleString()
                const newChat =  new Chats({
                    userId,
                    roomId,
                    createdAt,
                    chatName : createdAt,
                    chat
                 })

                await newChat.save()

                user.chats = [...user.chats,newChat._id]
                user.save()

                return {status:201,message:"Chat was added"}
            }



        }else{
            return {status:400, message:"Bad Request"}
        }
    },
    changeChat : async (chatId,newName)=>{
        if(chatId && newName){
            const findChat = await Chats.findById(chatId)

            if(findChat){
                findChat.chatName = newName
                await findChat.save()

                return {status: 202, message: "Chat Updated"}
            }else{
                return {status: 404, message: "Chat Not Found"}
            }
        }else{
            return {status: 400 , message : "Bad Request"}
        }
    },
    changeBonus : async (userId,bonus)=>{
        if(userId && bonus){
            const findUser = await User.findById(userId)

            if(findUser){
                findUser.chatBonus = findUser.chatBonus  + bonus

                await findUser.save()

                return {status: 202, message: "Bonus was changed"}
            }else{
                return {status : 404, message :"User Not Found"}
            }
        }else{
            return {status: 400, message : "Bad Request"}
        }
    }
};

module.exports = UserService;
