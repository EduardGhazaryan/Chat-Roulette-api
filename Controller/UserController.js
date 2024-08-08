const UserService = require('../Service/UserService.js');

const UserController = {
    search: async (req, res) => {
        try {
  
            const { gender, maxAge, minAge } = req.query;
            const {id} = req.params
   
        
            const data = await UserService.search(gender, parseInt(maxAge), parseInt(minAge),id);
            
            if(data.status === 200){
          
                res.status(data.status).send({ user: data.user });
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

            const data = await UserService.getUser(id)

            if(data.status === 200){
                res.status(data.status).send({user:data.user})
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
            const {lang} = req.query

            const data = await UserService.getNotification(lang)

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

            const data = await UserService.changeUser(id,gender,age)

            if(data.status === 202){
                res.status(data.status).send({user : data.user})
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


            const data = await UserService.addChat(roomId,chat,userId)

            res.status(data.status).send({message:data.message})
            
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    },
    changeChat : async(req,res)=>{
        try {
            const {newName}= req.body
            const {id} = req.params

            const data = await UserService.changeChat(id,newName)

            res.status(data.status).send({message:data.message})

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

            res.status(data.status).send({message:data.message})
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
};

module.exports = UserController;
