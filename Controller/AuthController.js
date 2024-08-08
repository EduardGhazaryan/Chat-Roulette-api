const AuthService = require('../Service/AuthService');

const AuthController = {
    signUp: async (req, res) => {
        try {
            const { age, gender, nickname, socketID, phoneID } = req.body;


            const data = await AuthService.signUp(gender, age, nickname,socketID,phoneID);

            if (data.status !== 201) {
                res.status(data.status).send({ message: data.message });
            } else {
                if(data.success){
                    res.status(data.status).send({ message: data.message , success:data.success, user: data.user , token : data.access_token});
                }else{
                    res.status(data.status).send({ message: data.message , success:data.success});
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    },
    signIn : async(req,res)=>{
        try {
            const {nickname, socketID,phoneID} = req.body

            const data = await AuthService.signIn(nickname,socketID,phoneID)

            if(data.status !== 201){
                res.status(data.status).send({ message: data.message });
            }else{
               if(data.success){
                res.status(data.status).send({ message: data.message, access_token: data.access_token, user: data.user, success:data.success });
               }else{
                res.status(data.status).send({ message: data.message, success:data.success});
               }
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    },
    signInToken :async (req,res)=>{
        try {
            const {token} = req.body

            const data = await AuthService.signInToken(token)

            if(data.status === 201){
                if(data.success){
                    res.status(data.status).send({message: data.message, user : data.user, success :data.success})
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
    singOut : async (req,res)=>{
        try {
            const {userId} = req.body

            const data = await AuthService.signOut(userId)

        
            res.status(data.status).send({ message: data.message });
        
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
};

module.exports = AuthController;
