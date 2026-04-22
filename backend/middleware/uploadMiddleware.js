import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ✅ Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = "auto"; // handles image + pdf

    return {
      folder: "bills",
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`,
    };
  },
});

// ✅ File filter (same logic, simplified)
const fileFilter = (_req, file, cb) => {
  const isValid =
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf";

  if (!isValid) {
    return cb(new Error("Only image or PDF files are allowed"));
  }

  cb(null, true);
};

// ✅ Multer config
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
});

// ✅ Middleware (same behavior as before)
export const uploadFile = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "File size must be 15MB or less"
          : err.message;

      return res.status(400).json({ ok: false, error: message });
    }

    return res.status(400).json({
      ok: false,
      error: err.message || "Upload failed",
    });
  });
};