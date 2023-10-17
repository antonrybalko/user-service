import Container from 'typedi';
import { RegisterController } from './RegisterController';

const registerController = Container.get(RegisterController);

export default registerController;
