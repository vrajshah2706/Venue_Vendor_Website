import {Request, Response} from "express"; 
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entity/User";

//repository for database operations
const userRepo = AppDataSource.getRepository(User); 

//Sign Up 
export const signUp = async (req: Request, res: Response ) => {

    try {
        //gettting data from frontend request 
        const {name, email, password, role } = req.body; 

        //validation 
        if(!name || !email || !password || !role ) {
            return res.status(400).json({
                message: "All fields are required "
            });
        }

        //checking if email already exists 
        const existingUser = await userRepo.findOne({
            where: {email}
        });

        if(existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            })
        }

        //creating new user object
        const newUser = userRepo.create({
            name, email, password, role
        })

        //saving into database 
        await userRepo.save(newUser); 

        //success response 
        return res.status(201).json({
            message: "User created successfully",
            user: newUser
        }); 


    } catch (error) {
        console.log(error); 

        return res.status(500).json({
            message: "Server error"
        }); 

    }

}

//Sign in 
export const signIn = async (req: Request, res: Response) => {

    try {

        //getting email and password from frontend 
        const {email, password}  = req.body; 

        //validation 
        if(!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        //finding user in database
        const user = await userRepo.findOne({
            where: {email}
        }); 

        //checking if user exist 
        if(!user){
            return res.status(404).json({
                message:  "Email not found"
            });
        }

        //checking password 
        if(user.password != password){
            return res.status(401).json({
                message: "Incorrect password"
            })
        }
        
        //success login 
        return res.status(200).json({
            message: `Welcome ${user.name}`,
            user
        })

    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        }); 
    }
}; 