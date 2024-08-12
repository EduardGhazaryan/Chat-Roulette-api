const UserService = require('../Service/UserService.js');

const UserController = {
    search: async (req, res) => {
        try {
  
            const { gender, maxAge, minAge } = req.query;
            const {id} = req.params
            const language = req.headers["accept-language"]
   
        
            const data = await UserService.search(gender, parseInt(maxAge), parseInt(minAge),id,language);
            
            if(data.status === 200){
          
                if(data.success){
                    res.status(data.status).send({ user: data.user , success:data.success});
                }else{
                    res.status(data.status).send({ message: data.message , success:data.success});
                }
                
            }else{
                res.status(data.status).send({ message: data.message });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    },
    getUser: async(req,res)=>{
        try {

            const {id}  = req.params
            const language = req.headers["accept-language"]

            const data = await UserService.getUser(id,language)

            if(data.status === 200){
                if(data.success){
                    res.status(data.status).send({user:data.user,success:data.success})
                }else{
                    res.status(data.status).send({message:data.message,success:data.success})
                }
            }else{
                res.status(data.status).send({message:data.message})
            }
            
        } catch (error) {
            console.error(error)
            res.status(500).send({message: "Internal Server Error"})
        }
    },
    getNotification : async (req,res)=>{
        try {
            const language = req.headers["accept-language"]

            const data = await UserService.getNotification(language)

            res.status(data.status).send({message:data.message})
        } catch (error) {
            console.error(error)
            res.status(500).send({message: "Internal Server Error"})
        }
    },
    changeUser: async (req,res)=>{
        try {
            const {gender,age}= req.body
            const {id} = req.params
            const language = req.headers["accept-language"]

            const data = await UserService.changeUser(id,gender,age,language)

            if(data.status === 202 || data.status === 200){
                
                if(data.success){
                    res.status(data.status).send({user : data.user, success: data.success})
                }else{
                    res.status(data.status).send({message : data.message, success: data.success})
                }
            }else{
                res.status(data.status).send({message:data.message})
            }
        } catch (error) {
            console.error(error)
            res.status(500).send({message: "Internal Server Error"})
        }
    },
    addChat: async (req,res)=>{
        try {

            const {roomId,chat,userId} = req.body
            const language = req.headers["accept-language"]


            const data = await UserService.addChat(roomId,chat,userId, language)

            if(data.status === 400){
                res.status(data.status).send({message:data.message})
            }else{
                res.status(data.status).send({message:data.message, success:data.success})
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    },
    changeChat : async(req,res)=>{
        try {
            const {newName}= req.body
            const {id} = req.params
            const language = req.headers["accept-language"]

            const data = await UserService.changeChat(id,newName, language)

            

            if(data.status === 202 || data.status === 200){
                if(data.success){
                    res.status(data.status).send({chat : data.chat, success: data.success})
                }else{
                    res.status(data.status).send({message : data.message, success: data.success})
                }
            }else{
                res.status(data.status).send({message:data.message})
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    },
    changeBonus : async(req,res)=>{
        try {
            const {bonus} = req.body

            const {id} = req.params

            const data = await UserService.changeBonus(id,bonus)

            
            if(data.status === 202 || data.status === 200){
                if(data.success){
                    res.status(data.status).send({user : data.user, message:data.message ,success: data.success})
                }else{
                    res.status(data.status).send({message : data.message, success: data.success})
                }
            }else{
                res.status(data.status).send({message:data.message})
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
};

module.exports = UserController;
