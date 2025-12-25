// src/config/cloudinary.config.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME || 'dexaivgv2',
    api_key: process.env.CLOUDINARY_KEY || '591836417799872',
    api_secret: process.env.CLOUDINARY_SECRET || 'm-kvPqIE8Dj3Fhhj1bKS3qHNH84',
    secure: true,
});

export default cloudinary;