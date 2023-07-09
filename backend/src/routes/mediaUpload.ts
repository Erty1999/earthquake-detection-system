import multer from "multer";
import { relative } from "path";

let fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //Create the uploads folder if it doesn't exists
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const lastIndex = file.mimetype.lastIndexOf("/");
    const extension = file.mimetype.substring(lastIndex + 1);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

export const upload = multer({ storage: storage });
