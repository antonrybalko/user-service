import { Logger } from "tslog";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { Request, Response, Router } from "express";
import { RegistrationService } from "./RegistrationService";
import { RegistrationDto } from "./dto/RegistrationDto";
import { RegisteredUserDto } from "./dto/RegisteredUserDto";
import { ConflictException } from "./exception/ConflictException";
import { sanitize } from "class-sanitizer";

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    // Validate the request body
    const registrationDto = plainToClass(RegistrationDto, req.body);
    const errors = await validate(registrationDto);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    sanitize(registrationDto);

    const registerService = new RegistrationService();

    try {
        // Register the user
        const newUser = await registerService.registerUser(registrationDto);
        res.status(201).json(new RegisteredUserDto(newUser));
    } catch (error) {
        if (error instanceof ConflictException) {
            res.status(409).json({ error: error.message });
        } else {
            const logger = new Logger();
            logger.error(error);
            res.status(500).json({error: 'Unknown error'});
        }
    }
});

export default router;