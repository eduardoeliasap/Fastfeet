import multer from 'multer'; // MultiFromData
import crypto from 'crypto';
import { extname, resolve } from 'path';

// The first key is storage, which is how the multer will store the image files.
// "destination" and "filename" are diskStorage required parameters.
export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),

    // Indicates how we are going to format the name of our image file
    // filename function accepts (req, file and the callback)
    filename: (req, file, cb) => {
      // I am working the image name to have unique files in my app
      // I am generating 16 random characters to form the image file name
      crypto.randomBytes(16, (err, res) => {
        // Return callBack variable if randomBytes error occurred
        if (err) return cb(err);

        // If there was no error, I return the callBack with final result
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};

/**
 * ** CDNs (Content Delivery Network) Production environment servers **
 * Amazon Storage, Digital Ocean Space
 */
