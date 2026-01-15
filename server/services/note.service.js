import prisma from "../config/prisma.js";

const getAllNotes = async () => {
    const notes = await prisma.note.findMany();
    return notes;
}

const upsertNote = async (data) => {
    const note = await prisma.note.upsert({
        where: {id: data.id},
        update: {
            title: data.title,
            content: data.content,
            updatedAt: new Date()
        },
        create: {
            id: data.id,
            title: data.title,
            content: data.content,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })

    return note;
}

export default {
    getAllNotes,
    upsertNote
}