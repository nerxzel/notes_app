import localDb from './localDb';
import api from './axiosConfig'; 

export const pushChanges = async () => {
 
    const pendingNotes = await localDb.getUnsyncedNotes();

    if (pendingNotes.length === 0) {
        return;
    }

    for (const note of pendingNotes) {
        try {
            if (note.deletedAt) {
                await api.delete(`/${note.id}`); 
            } else {
                const { synced, ...noteData } = note; 
                await api.put('/', noteData);
            }

            await localDb.markNoteAsSynced(note.id);

        } catch (error) {
            console.error(`Error syncing note ${note.id}:`, error.message);

        }
    }
};

export const pullChanges = async () => {
    try {

        const response = await api.get('/');
        const serverNotes = response.data;

        if (!serverNotes || serverNotes.length === 0) return;

        for (const note of serverNotes) {
            await localDb.mergeNote(note);
        }
        
    } catch (error) {
        console.error("Error in pullChanges:", error);
    }
};