import cloudinary from "../../../shared/config/cloudinary.config.js";
import User from "../../../shared/models/User.js";

export const uploadCoverPictureCloud = async (req, res) => { 
    const { _id } = req.loggedInUser;
    const { file } = req;

    console.log(file);
    if (!file) {
        return res.status(400).json({ message: "no files" });
    }

    try {
        const data = await cloudinary.uploader.upload(file.path, {
            folder: `${process.env.CLOUDINARY_FOLDER}/cover`,
        });
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                avatar: { 
                    secure_url: data.secure_url,
                    public_id: data.public_id,
                },
            },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Cover picture uploaded successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload cover picture to cloud service.",
            error: error.message
        });
    }
  };


export const uploadCoverPictureCloudMultiple = async(req,res)=>{
    const {_id} = req.loggedInUser;
    const {files} = req
    
    if(!files.length){
        return res.status(400).json({message:"no files uploaded"})
    }

    const Images=[]
    for(const file of files){
        const {secure_url,public_id} = await cloudinary.uploader.upload(file.path,{
            folder:`${process.env.CLOUDINARY_FOLDER}/Users/Covers`,
        })
        Images.push({secure_url,public_id})
    }
    const user = await User.findByIdAndUpdate(_id,{coverPictures:Images},{new:true})

    res.status(200).json({message:'cover picture uploaded successfully',user})
}

