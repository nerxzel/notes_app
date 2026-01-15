import noteService from "../services/note.service.js"

const findAll = async (req, res, next) => {
    try {
        const notes = await noteService.getAllNotes();
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};

const upsert = async (req, res, next) => {
    try {
        const note = await noteService.upsertNote(req.body)
        res.status(201).json(note)
    } catch (error) {
        next(error)
    }
}

export default {
    findAll,
    upsert
}
