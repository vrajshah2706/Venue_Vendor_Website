import express from "express"; 
import { signUp, signIn } from "../controllers/authController";

const router = express.Router(); 

//signup route 
router.post("/signup", signUp ); 
//signin route 
router.post("/signin", signIn); 

export default router; 
