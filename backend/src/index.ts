import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/authRoutes"; 
import vendorRoutes from "./routes/vendorRoutes";
import userRoutes from "./routes/userRoutes";
import venueRoutes from "./routes/venueRoutes";
import unavailableSlotRoutes from "./routes/unavailableSlotRoutes";
import hirerRoutes from "./routes/hirerRoutes";


import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes); 
app.use("/vendors", vendorRoutes);
app.use("/users", userRoutes); 
app.use("/uploads", express.static("uploads"));

app.use("/vendors", venueRoutes);
app.use("/venues", venueRoutes); 
app.use("/slots", unavailableSlotRoutes);
app.use("/",hirerRoutes);


AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );

