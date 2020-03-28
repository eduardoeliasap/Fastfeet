// Check if the user is logged in

import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth'; // This file is the secret of the token. This is necessary to know if the informed token is valid

// The next is used to determine whether our application will continue executing the method
export default async (req, res, next) => {
  const authHeader = req.headers.authorization; // This is the way to return the header token

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // console.log(authHeader);

  /**
   * Return an array with two positions.
   * The first one will count the string 'Bearer' (which I don't need so I can use just a comma
   * de-structuring). The second is the token
   */
  const [, token] = authHeader.split(' ');

  try {
    /**
     * The verify command verifies that the informed token is valid using the secret
     * inside config-> auth.js
     */
    // The promisty command transforms the function without the need for a callback
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // console.log(decoded);

    /**
     * I am registering the logged user id in a variable called userId
     * that can be used throughout the project
     */
    req.userId = decoded.id;

    return next(); // Required to continue executing the method
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
