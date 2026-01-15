import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client'

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});