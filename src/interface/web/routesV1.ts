import Container from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import LoginController from './controllers/login/LoginController';
import RegisterController from './controllers/register/RegisterController';
import { AuthenticateMiddleware } from './middleware/AuthenticateMiddleware';
import { EnsureAdminUser } from './middleware/EnsureAdminUser';
import UserController from './controllers/manageUser/UserController';
import CurrentUserController from './controllers/getCurrentUser/CurrentUserController';
import { OrganizationController } from './controllers/organization/OrganizationController';

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

const authenticateMiddleware = Container.get(AuthenticateMiddleware);
const ensureAdminUser = Container.get(EnsureAdminUser);
const userController = Container.get(UserController);
const organizationController = Container.get(OrganizationController);

// Middleware to authenticate and ensure the user is an admin for certain routes
const authenticateAndAuthorize = [
  (req: Request, res: Response, next: NextFunction) =>
    authenticateMiddleware.authenticate(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    ensureAdminUser.ensure(req, res, next),
];

// Current user information
router.get(
  '/me',
  authenticateMiddleware.authenticate.bind(authenticateMiddleware),
  (req: Request, res: Response) => {
    const meController = Container.get(CurrentUserController);
    return meController.getCurrentUser(req, res);
  },
);

// Organization
router.post(
  '/me/organizations',
  authenticateMiddleware.authenticate.bind(authenticateMiddleware),
  (req: Request, res: Response) => {
    return organizationController.createOrganization(req, res);
  },
);

router.put(
  '/me/organizations/:guid',
  authenticateMiddleware.authenticate.bind(authenticateMiddleware),
  (req: Request, res: Response) => {
    return organizationController.updateOrganization(req, res);
  },
);

// User management routes
router.get('/users', authenticateAndAuthorize, (req: Request, res: Response) =>
  userController.getAllUsers(req, res),
);
router.get(
  '/users/:guid',
  authenticateAndAuthorize,
  (req: Request, res: Response) => userController.getUserByGuid(req, res),
);
router.put(
  '/users/:guid',
  authenticateAndAuthorize,
  (req: Request, res: Response) => userController.updateUser(req, res),
);

export { router };
