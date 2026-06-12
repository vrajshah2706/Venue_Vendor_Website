import { AppDataSource } from "../../data-source";
import { User, UserRole } from "../../entity/User";

export const adminResolver = {

Mutation: {
    login: async (_: any,{email,password,}: {email: string;password: string;}) => {

    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
          where: {
            email,
            password,
          },
    });

    if (!user) {
        return {
          success: false,
          message:
            "Invalid credentials",
        };
    }
    if (user.email !== email || user.password !== password) {
        return {
            success: false,
            message: "Invalid credentials",
        };
    }

    if ( user.role !== UserRole.ADMIN) {
        return {
          success: false,
          message:
            "Not an admin account",
        };
    }

    return {
        success: true,
        message:
          "Login successful",
      };
    },
  },
};