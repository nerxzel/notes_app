import { Card, Form, Button } from 'react-bootstrap';
import { ulid } from 'ulid'
import { useState, useEffect } from 'react';
import localDb from '../services/localDb.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/index.css'

function NoteForm({ onNoteSaved, editing, onCancel }) {

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    useEffect(() => {
        if (editing) {
            setTitle(editing.title);
            setContent(editing.content);
        } else {
            setTitle("");
            setContent("");
        }
    }, [editing])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) return;

        const noteId = editing ? editing.id : ulid();
        const newNote = {
            id: noteId,
            title: title,
            content: content
        }

        try {
            await localDb.createNote(newNote)

            setTitle("")
            setContent("")

            if (onNoteSaved) {
                onNoteSaved()
            };
        } catch (error) {
            console.error("Error saving:", error)

        }
    }

    return (
        <Card className={`mb-4 shadow ${editing ? "border-warning" : "border-primary"}`}>
            <Card.Header className={editing ? "bg-warning bg-opacity-10" : "bg-primary bg-opacity-10"}>
                <h5 className="card-title text-muted mb-3">
                    {editing ? "Edit Note" : "New Note"}
                </h5>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ex: Grocery shopping..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Add a description..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>
                    <div>
                        <Button variant={editing ? "warning" : "success"} type="submit">{editing ? "Update" : "Save"}</Button>
                        {editing && (<Button variant="secondary" onClick={() => {
                            setTitle("");
                            setContent("");
                            onCancel();
                        }}>Cancel</Button>)}
                    </div>
                </Form>
            </Card.Body>
        </Card>
    )

}

export default NoteForm;