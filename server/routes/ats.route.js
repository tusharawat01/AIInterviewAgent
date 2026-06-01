import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { checkAts } from "../controllers/ats.controller.js"

const atsRouter = express.Router()

atsRouter.post("/check", isAuth, upload.single("resume"), checkAts)

export default atsRouter
