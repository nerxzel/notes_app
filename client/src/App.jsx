import { useState, useEffect } from 'react';
import { Container, Col, Row, Card, Badge, Button } from 'react-bootstrap';
import localDb from './services/localDb'
import NoteForm from './components/NoteForm';
import { pushChanges, pullChanges } from './services/sync';

function App() {

  const [noteList, setNoteList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    if (isOnline) {
      pushChanges().then(() => {
        loadNotes();
      });
    }
  }, [isOnline]);

  useEffect(() => {

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this note??")) {
      await localDb.softDeletedNote(id)
      loadNotes()
    }
  }

  const handleEdit = async (note) => {
    setEditing(note)
  }

  const handleCancel = async () => {
    setEditing(null)
  }

  const loadNotes = async () => {
    try {
      const notes = await localDb.getAllNotes();
      setNoteList(notes)
    } catch (error) {
      console.error("Error loading notes...");
    }
  };

  useEffect(() => {
    loadNotes();
  }, [])

  const handleSaveAndSync = async () => {

    await loadNotes();
    setEditing(null);


    if (isOnline) {
      await pushChanges();
      await pullChanges();
      loadNotes();
    }
  };

  useEffect(() => {
    if (!isOnline) return;

    const syncInterval = setInterval(() => {

      pushChanges()
        .then(() => pullChanges())
        .then(() => loadNotes());
    }, 10000);

    return () => clearInterval(syncInterval);

  }, [isOnline]);

  return (

    <Container className="mt-5 pb-5">
      <Row>
        <Col md={{ span: 8, offset: 2 }}>

          {!isOnline && (
            <div className="alert alert-danger text-center sticky-top shadow-sm">
              <strong>Offline</strong> (No internet connection)
              <br />
            </div>
          )}

          {isOnline && (
            <div className="alert alert-success text-center sticky-top shadow-sm">
              <strong>Online</strong> (Connected to internet)
            </div>
          )}

          <h2 className="text-center mb-4 fw-bold text-secondary">My Notes</h2>
          <NoteForm
            onNoteSaved={handleSaveAndSync}
            editing={editing}
            onCancel={handleCancel} />
          <hr className="my-5" />

          <h4 className="mb-3 text-muted">Saved Notes: ({noteList.length}) </h4>

          {noteList.length === 0 && (
            <div>
              <p className="text-center text-muted">No notes yet...</p>
            </div>)}

          <div className="d-flex flex-column gap-3">
            {noteList.map((note) => (
              <Card key={note.id} className="shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="fw-bold text-primary">{note.title}</Card.Title>
                    <Badge bg={note.synced ? "success" : "warning"} pill>
                      {note.synced ? "Synced" : "Local"}
                    </Badge>
                  </div>

                  <Card.Text className="text-secondary" style={{ whiteSpace: 'pre-wrap' }}>

                    {note.content}
                  </Card.Text>
                </Card.Body>

                <Card.Footer className="bg-white border-top-0 d-flex justify-content-end gap-2 pb-3">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => handleEdit(note)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDelete(note.id)}
                  >
                    Delete
                  </Button>
                </Card.Footer>
              </Card>
            ))}
          </div>
        </Col>
      </Row>
    </Container >
  )
}

export default App
