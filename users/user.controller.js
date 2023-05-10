const { isUserAvail } = require('./user.model');
const userModel = require('./user.model')

class userController {    

  dataUser = async (req, res) => {
    const allUser = await userModel.getAllUser();
    return res.json(allUser);
  };

  userRegister = async (req, res) => {
    const requestData = req.body;
    // Cek pengisian user,email,pass
    if (requestData.username === undefined || requestData.username === "") {
      res.statusCode = 400;
      return res.json({ message: "Username is invalid" });
    }
    
    if (requestData.email === undefined || requestData.email === "") {
      res.statusCode = 400;
      return res.json({ message: "Email is invalid" });
    }
    
    if (requestData.password === undefined || requestData.password === "") {
      res.statusCode = 400;
        return res.json({ message: "Password is invalid" });
      }
      
    // Cek email yang telah teregis
    const hasilData = await userModel.isUserAvail(requestData);
console.log(hasilData)
    if (hasilData) {
      return res.json({ message: "User / Email sudah terdaftar" });
    }

    //   record data kedalam userList
    userModel.recordNewData(requestData);
      return res.json({ message: "registrasi berhasil" });
    }


    // Cek Login
    userLogin = async (req, res) => {
        const {userOrEmail, password} = req.body;
        const hasilLogin = await userModel.checkUserLogin(userOrEmail, password);
      console.log(`datalogin ${hasilLogin}`)
      if (hasilLogin) {
        return res.json(hasilLogin)
      } else {return res.json({message: 'Credential tidak ditemukan'})}
    }

      //Cek Detail
    userDetail = async (req, res) => {
      const { idUser } = req.params;
      try {
        const users = await userModel.getProfileUser(idUser);
        if (users) {
          return res.json(users)
        } else {
          res.statusCode = 400;
          return res.json({message: `User ${idUser} tidak ditemukan`});
      }
      } catch (error) {
        res.statusCode = 401
        return res.json({message: `User ${idUser} tidak ditemukan`});
      }
    }
    
    //Update user profile
    userUpdate = async (req, res) => {
      const { idUpdate } = req.params;
      const {fullName, address, phoneNumber} = req.body;
      const user = await userModel.getSingleUser(idUpdate)
      try {
        if (!user) {
          res.statusCode = 400
          return res.json({message: "User tidak ditemukan"})
        }
        console.log(user)  
        const users = await userModel.updateSingleUser(fullName, address,phoneNumber, idUpdate);
        return res.json(users)
        } 
      catch (error) {
        console.log(error)
        }
    }
  
    //record game
    recordGame = async (req, res) => {
      const { idUser } = req.params;
      const {resultGame, gameName} = req.body
      const user = await userModel.getSingleUser(idUser)
      try {
        if (!user) {
          res.statusCode = 400
          return res.json({message: "User tidak ditemukan"})
        }
        const userGame = await userModel.updateGameResult(resultGame, gameName, idUser)
        return res.json(userGame);
      } catch (error) {
        console.log(error)
      }
  }

  singleGameHistory = async (req, res) => {
    const { idUser } = req.params;
      const user = await userModel.getSingleUser(idUser)
      try {
        if (!user) {
          res.statusCode = 400
          return res.json({message: "User tidak ditemukan"})
        }
        const userGame = await userModel.dataGameHistory(idUser)
        return res.json(userGame);
      } catch (error) {
        console.log(error)
      }
  }
}

  
  module.exports = new userController;
  