import { body } from "express-validator";

const makeNameValidator = () =>
  body("name")
    .exists()
    .withMessage("name is required")
    .bail()
    .isString()
    .withMessage("name must be a string")
    .bail()
    .notEmpty()
    .withMessage("name cannot be empty");

const makeProfilePictureURLValidator = () =>
  body("profilePictureURL")
    .optional({ nullable: true })
    .isString()
    .withMessage("profilePictureURL must be a string");

// establishes a set of rules that the body of the user creation route must follow
export const createUser = [makeNameValidator(), makeProfilePictureURLValidator()];
