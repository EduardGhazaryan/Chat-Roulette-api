const User = require('../Model/User.js');
const { generateAccessToken } = require('../Utils/GenerateToken.js');

const AuthService = {
    signUp: async (gender, age, nickname,socketID,phoneID) => {
        if (gender && age && nickname) {
            const findUser = await User.findOne({ nickname });
            if (findUser) {
                return { status: 409, message: "Nickname already exists" };
            } else {
          
                const newUser = new User({
                    age,
                    gender,
                    nickname,
                    socketID,
                    phoneID
                });

                const access_token = generateAccessToken(newUser);

                await newUser.save();

                return { status: 201, message: "You have successfully registered", access_token };
            }
        } else {
            return { status: 400, message: "Bad Request" };
        }
    },
    signIn : async (nickname,socketID,phoneID)=>{
        if(nickname && socketID, phoneID){
            let findUser = await User.findOne({nickname})

            if(findUser){
                if(findUser.phoneID === phoneID){
                    if(findUser.status === "online"){
                        return {status:409,message: 'User already logged in from another device'}
                    }else{
                        findUser.status = "online"
                        findUser.socketID = socketID
                        await findUser.save()
                        const access_token = generateAccessToken(findUser)
    
                        return { status: 201, message: "You have successfully logged in", access_token };
                    }
    
               
                }else{
                    return  {status: 401, message: 'Invalid phone ID' }
                }
            }else{
                return {status:404, message :"User not found"}
            }
        }else{
            return {status:400, message :"Bad Request"}
        }
    },
    signOut: async(userId)=>{
        if(userId){
            let findUser = await User.findById(userId)
    
            if(findUser){
                findUser.status = "offline"
                await  findUser.save()

                return { status: 201, message: 'User logged out successfully'};
            }else{
                return {status:404, message :"User not found"}
            }
        }else{
            return {status:400, message :"Bad Request"}
        }
    }
};

module.exports = AuthService;
