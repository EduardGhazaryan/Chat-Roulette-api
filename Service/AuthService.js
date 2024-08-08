const User = require('../Model/User.js');
const { generateAccessToken } = require('../Utils/GenerateToken.js');

const AuthService = {
    signUp: async (gender, age, nickname,socketID,phoneID) => {
        if (gender && age && nickname) {
            const findUser = await User.findOne({ nickname });
            if (findUser) {
                return { status: 201, message: "Nickname already exists" , success: false};
            } else {

                const userObj = {
                    age,
                    gender,
                    nickname,
                    socketID,
                    phoneID
                }
          
                const access_token = generateAccessToken(userObj);
                const newUser = new User({
                    age,
                    gender,
                    nickname,
                    socketID,
                    phoneID,
                    access_token
                });


                await newUser.save();

                return { status: 201, message: "You have successfully registered", success: true, access_token, user: newUser };
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
                   
                  
                        findUser.status = "online"
                        findUser.socketID = socketID
                       
                        await findUser.save()
    
                        return { status: 201, message: "You have successfully logged in", user: findUser, success:true };
                    
    
               
                }else{
                    return  {status: 201, message: 'Invalid phone ID' , success :false}
                }
            }else{
                return {status:201, message :"User not found", success: false}
            }
        }else{
            return {status:400, message :"Bad Request"}
        }
    },
    signInToken : async (token)=>{
        if(token){
            const findUser = await User.findOne({access_token :token})

            if(findUser){
                return {status: 201, message: "You have successfully logged in", user: findUser, success:true }
            }else{
                return {message: "Invalid Token", success:false, status: 201}
            }
        }else{
            return {status: 400, message :"Bad Request"}
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
