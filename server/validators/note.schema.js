import { z } from "zod";

const ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/i;

const noteSchema = z.object({
    id: z.string().regex(ULID_REGEX, { message: "Invalid UUID"}),
    title: z.string().min(1, {message: "Title cannot be empty"}),
    content: z.string().optional(),
})

export default noteSchema;