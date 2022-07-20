import { check } from "express-validator";

const title = check("title", "Title must not be less than 4 character and greater than 300 character.").isLength({min:4, max: 300})
const description = check("description", "Description must not be less than 5 characters").isLength({min:5})
const category = check("category", "Category must not be empty.").not().isEmpty()

export const videoValidation = [title, description, category]