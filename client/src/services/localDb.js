import { openDB } from 'idb';

const DB_NAME = 'notes_app_db';
const STORE_NAME = 'notes';

const getDB = async () => {
    return openDB(DB_NAME, 1, {upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id'});
            }
        }
    })
}


const getAllNotes = async () => {
    const db = await getDB();

    const allNotes = await db.getAll(STORE_NAME);
    const filteredNotes = allNotes.filter(note => !note.deletedAt);

    return filteredNotes
}

const createNote = async (note) => {
    const db = await getDB();

    const noteToCreate = {
        ...note, 
        synced: false,
        updatedAt: new Date().toISOString()
    };

    await db.put(STORE_NAME, noteToCreate);

    return noteToCreate;
}

const softDeletedNote = async (id) => {
    const db = await getDB();

    const note = await db.get(STORE_NAME, id)

    if (!note) return;

    const deletedNote = {
        ...note,
        deletedAt: new Date().toISOString(),
        synced: false,
        updatedAt: new Date().toISOString()
    };

    await db.put(STORE_NAME, deletedNote);
    return deletedNote;
}

const markNoteAsSynced = async (id) => {
    const db = await getDB();
    
    const note = await db.get(STORE_NAME, id)

    if (!note) return;

    note.synced = true;

    await db.put(STORE_NAME, note);
}

const getUnsyncedNotes = async () => {
    const db = await getDB();

    const allNotes = await db.getAll(STORE_NAME);
    const filteredNotes = allNotes.filter(note => note.synced === false);

    return filteredNotes;
}

const mergeNote = async (serverNote) => {
    const db = await getDB();
    const localNote = await db.get(STORE_NAME, serverNote.id);

 
    if (!localNote) {

        console.log("revisar aquí:" + serverNote.deletedAt)
        if (serverNote.deletedAt) return;
        
        await db.put(STORE_NAME, { ...serverNote, synced: true });
        return;
    }

    const serverTime = new Date(serverNote.updatedAt).getTime();
    const localTime = new Date(localNote.updatedAt).getTime();

    if (serverTime > localTime) {
        
        await db.put(STORE_NAME, { ...serverNote, synced: true });
    } 
}

export default {
    getAllNotes,
    createNote,
    softDeletedNote,
    markNoteAsSynced,
    getUnsyncedNotes,
    mergeNote
}