import Container from 'typedi';
import { Router, Request, Response } from 'express';
import LoginController from './interface/api/login/LoginController';
import RegisterController from './interface/api/register/RegisterController';
import userRouter from './interface/api/manageUser/UserController';

const router = Router();

router.get('/', (request: Request, response: Response) => {
  return response.json({ status: 'OK' });
});

router.post('/register', (request: Request, response: Response) => {
  const registerController = Container.get(RegisterController);
  return registerController.handle(request, response);
});

router.post('/login', (request: Request, response: Response) => {
  const loginController = Container.get(LoginController);
  return loginController.handle(request, response);
});

router.use('/users', userRouter);

export { router };
