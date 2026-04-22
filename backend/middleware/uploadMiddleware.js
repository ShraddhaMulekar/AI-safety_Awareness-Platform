import fs from "fs";
import path from "path";
import multer from "multer";

const uploadPath = path.resolve("uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedTypes = ["image/", "application/pdf"];

  const isValid = allowedTypes.some((type) => file.mimetype.startsWith(type));

  if (!isValid) {
    return cb(new Error("Only image or PDF files are allowed"));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (!err) {
      return next();
    }

    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Image size must be 5MB or less"
          : err.message;
      return res.status(400).json({ ok: false, error: message });
    }

    if (err.message?.includes("Unexpected end of form")) {
      return res.status(400).json({
        ok: false,
        error:
          "Incomplete upload request. Send multipart/form-data with the image field and do not set the boundary manually.",
      });
    }

    return res.status(400).json({ ok: false, error: err.message });
  });
};
