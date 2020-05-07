/**
 *  Check if the user is logged in
 * */
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization; // This is the way to return the header token

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  /**
   * Return an array with two positions.
   * The first one will the string 'Bearer' count (which I don't need so I can use just a comma
   * destructuring). The second is the token
   */
  const [, token] = authHeader.split(' ');

  try {
    /**
     * The verify command verifies that the informed token is valid using the secret
     * inside config->auth.js
     */
    // The promisty command transforms the function without the need for a callback
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    /**
     * I am registering logged user id in a variable called userId
     * that can be used throughout the project
     */
    req.userId = decoded.id;

    return next(); // Required to continue executing the method
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
