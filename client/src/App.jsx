import { useState, useEffect } from 'react';
import { Container, Col, Row, ListGroup, Badge } from 'react-bootstrap';
import localDb from './services/localDb'
import NoteForm from './components/NoteForm';

function App() {

  const [noteList, setNoteList] = useState([])

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

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h1 className="text-center mb-4">Notas</h1>
          <NoteForm onNoteSaved={loadNotes} />
          <hr />

          <ListGroup>
            {noteList.lenght === 0 && <p className="text-center text-muted">There is not any note writen yet...</p>}

            {noteList.map((note) => (
              <ListGroup.Item key={note.id} className="d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{note.title}</div>
                  {note.content}
                </div>

                <Badge bg={note.synced ? "success" : "warning"} pill>
                  {note.synced ? "Sync" : "Local"}
                </Badge>

              </ListGroup.Item>))}
          </ListGroup>
        </Col>
      </Row>
    </Container >
  )
}

export default App
