"use server"
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import { createCanvas } from 'canvas';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const pdfToImage = async (pdfBuffer: any) => {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const page: any = pdfDoc.getPage(0);

    const { width, height } = page.getSize();
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    const pdfImage: any = await page.render({
        canvasContext: context,
        viewport: page.getViewport({ scale: 1 }),
    }).promise;

    return new Promise((resolve, reject) => {
        canvas.toDataURL('image/png', (err, imgBuffer) => {
            if (err) reject('Error converting PDF page to image');
            resolve(imgBuffer);
        });
    });
};
export const savePdfFirstPage = async (pdfPath: any, folderName: string) => {
    try {
        const pdfBuffer = fs.readFileSync(pdfPath);
        const imgBuffer: any = await pdfToImage(pdfBuffer);

        const uploadResponse = await cloudinary.uploader.upload(imgBuffer, {
            folder: folderName,
            format: 'png'
        });

        return uploadResponse.url;
    } catch (error) {
        console.error('Error uploading PDF first page:', error);
        return '';
    }
};