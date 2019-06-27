const cloudinary = require("cloudinary");
const config = require("./env.config");



cloudinary.config({
    cloud_name : config.CLOUDINARY_NAME,
    api_key : config.CLOUDINARY_API_KEY,
    api_secret : config.CLOUDINARY_API_SECRET
});

module.exports = {

    uploads : async (file) => {
        return new Promise(resolve => {
            cloudinary.uploader.upload(file, (result) =>{
                resolve({url: result.secure_url, id: result.public_id, originalName : result.original_filename})
            }, {resource_type: "auto", folder:"btbpictures"})
        })
    }

};

