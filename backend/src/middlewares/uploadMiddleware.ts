// // This is the code for uploading the completed assignment from expert.

// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination(_req, _file, cb) {
//     cb(null, path.join(__dirname, "../../uploads/assignmentdone"));
//   },
//   filename(_req, file, cb) {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, unique + "-" + file.originalname);
//   },
// });

// export const uploadassignmentdone = multer({ storage });




import path from "path";
import fs from "fs";
import multer from "multer";

const uploadsDir = path.join(
  __dirname,
  "..",
  "..",
  "uploads",
  "assignmentdone"
);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}-${safeName}`);
  },
});

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed"));
  }
  cb(null, true);
}

export const deliverableUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});
