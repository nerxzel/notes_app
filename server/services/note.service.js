import prisma from "../config/prisma.js";

const getAllNotes = async () => {
    const notes = await prisma.note.findMany({
        where: { deletedAt: null }
    });
    return notes;
}

const upsertNote = async (data) => {
    const newNote = await prisma.note.upsert({
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

    return newNote;
}

const softDeleteNote = async (id) => {
    const deletedNote = await prisma.note.update({
        where: {id: id},
        data: {
            deletedAt: new Date()
        }
    });

    return deletedNote;
}

export default {
    getAllNotes,
    upsertNote,
    softDeleteNote
}