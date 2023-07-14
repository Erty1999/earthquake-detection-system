import multer from "multer";

let fs = require("fs");

const storageFile = multer.diskStorage({
  destination: function (req, file, cb) {
    //Create the files folder if it doesn't exists
    if (!fs.existsSync("files")) {
      fs.mkdirSync("files");
    }
    cb(null, "files/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

export const uploadFile = multer({ storage: storageFile });
