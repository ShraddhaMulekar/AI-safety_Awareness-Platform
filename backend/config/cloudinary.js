import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

console.log("Cloudinary Config - Cloud Name:", process.env.CLOUD_NAME);
console.log("Cloudinary Config - API Key:", process.env.CLOUD_API_KEY);
console.log("Cloudinary Config - API Secret:", process.env.CLOUD_API_SECRET);


export default cloudinary;