import { NextFunction, Request, Response } from 'express';
import { AppError } from '../middlewares/errorHandler.middleware';
import UserModel, { UserType } from '../models/user.model';
import bcrypt from 'bcrypt';
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
} from '../utils/token';
import jwt from 'jsonwebtoken';
import { JWT_REFRESH_TOKEN_SECRET } from '../config/env';
const saltRounds = 10;

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, userName } = req.body;

    if (!email || !userName || !password) {
      const error: AppError = new Error(
        'Email, Username and Password are required'
      );
      error.status = 400;
      throw error;
    }
    // check for user existance
    UserModel.findOne({ $or: [{ email }, { userName }] }).then(
      (existingUser) => {
        // if user already exists
        if (existingUser) {
          const error: AppError = new Error(
            'User with given email or username already exists'
          );
          error.status = 409; // conflict
          next(error);
        }
        // hash given password
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            const newUser = new UserModel({
              email,
              userName,
              password: hash,
              projects: [],
              createdAt: new Date(),
            });
            // save user to database
            newUser
              .save()
              .then(() => {
                // return success response
                res.status(201).json({
                  status: 'success',
                  message: 'User registered successfully.',
                  data: { userId: newUser._id, email, userName },
                });
              })
              .catch((error) => {
                // or error response
                const err: AppError = new Error(
                  'Database error: unable to save user'
                );
                err.status = 500;
                next(error);
                return;
              });
          });
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error: AppError = new Error('Email and Password are required');
      error.status = 400;
      throw error;
    }
    // check for user existance
    UserModel.findOne({ email }).then((existingUser: UserType | null) => {
      if (!existingUser) {
        const error: AppError = new Error('Invalid email or password');
        error.status = 401;
        return next(error);
      }
      // compare the password
      bcrypt.compare(password, existingUser.password, function (err, result) {
        if (!result) {
          // incorrect password
          const error: AppError = new Error('Invalid email or password');
          error.status = 403;
          return next(error);
        }
        // correct
        const accessToken = generateAccessToken({
          userId: existingUser._id.toString(),
        });

        const refreshToken = generateRefreshToken({
          userId: existingUser._id.toString(),
        });

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        });

        res.status(200).json({
          status: 'success',
          message: 'User login successfull',
          data: {
            userId: existingUser._id,
            email,
            userName: existingUser.userName,
          },
          accessToken,
        });
      });
    });
  } catch (error) {
    next(error);
    return;
  }
};

export const newAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshTokenObj = req.cookies && req.cookies.refreshToken;

    const token = refreshTokenObj && refreshTokenObj.token;
    if (!token) {
      const error: AppError = new Error('Refresh token missing');
      error.status = 401;
      return next(error);
    }

    const payload = jwt.verify(
      token,
      JWT_REFRESH_TOKEN_SECRET || 'i-am-key'
    ) as TokenPayload;

    const newToken = generateAccessToken({ userId: payload.userId });

    res.status(200).json({
      status: 'success',
      message: 'New access token generated',
      accessToken: newToken,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      const jwtError: AppError = new Error('Invalid refresh token');
      jwtError.status = 401;
      return next(jwtError);
    } else if (error instanceof jwt.TokenExpiredError) {
      const expiredError: AppError = new Error('Refresh token expired');
      expiredError.status = 401;
      return next(expiredError);
    }
    return next(error); // Handle other errors
  }
};
