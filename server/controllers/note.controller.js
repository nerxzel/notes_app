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
        const newNote = await noteService.upsertNote(req.body)
        res.status(201).json(newNote)
    } catch (error) {
        next(error)
    }
}

const softDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedNote = await noteService.softDeleteNote(id)
        res.status(200).json({message: "Note successfully deleted"});
    } catch (error) {
        next(error);
    }
}

export default {
    findAll,
    upsert,
    softDelete
}
