import multer from "multer"
import fs from "fs"


export const Multer = (destinationPath='General',allowedExtensions=[]) => {
    const storage = multer.diskStorage({
        destination:(req,file,cb)=>{
            if(!fs.existsSync(destinationPath)){
                fs.mkdirSync(destinationPath,{recursive:true})
            }
            cb(null,destinationPath)
        },
        filename:(req,file,cb)=>{
            console.log(file);
            const uniqeSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
            const filename = `${uniqeSuffix}-${file.originalname}`
            cb(null,filename)
        }
    })

    const fileFilter = (req,file,cb)=>{
        if(allowedExtensions.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(null,false)
            return cb(new Error("Invalid file type"))
            res.status(400).json({message:"Invalid file type"})
        }
    }

    const upload = multer({fileFilter,storage});
    return upload;
}


export const MulterHost = (allowedExtensions=[]) => {
    const storage = multer.diskStorage({})

    const fileFilter = (req,file,cb)=>{
        if(allowedExtensions.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(null,false)
            return cb(new Error("Invalid file type"))
            res.status(400).json({message:"Invalid file type"})
        }
    }

    const upload = multer({fileFilter,storage});
    return upload;
}