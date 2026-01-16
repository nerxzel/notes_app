import { Card, Form, Button } from 'react-bootstrap';
import { ulid } from 'ulid'
import { useState, useEffect } from 'react';
import localDb from '../services/localDb.js'

function NoteForm({ onNoteSaved }) {

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) return;

        const newNote = {
            id: ulid(),
            title: title,
            content: content
        }

        try {
            await localDb.createNote(newNote)

            setTitle("")
            setContent("")

            console.log("Note saved at localDb", newNote)

            if (onNoteSaved) {
                onNoteSaved()
            };
        } catch (error) {
            console.error("Error al guardar:", error)

        }
    }

    const handleEdit = async (e) => { }

    const handleDelete = async (e) => { }


    return (
        <Card className="mb-4">
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ex: Buy bread..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Write the details..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="success" type="submit">Save</Button>

                    {/*<Button variant="primary">Edit</Button>
                    <Button variant="danger">Delete</Button>*/}
                </Form>
            </Card.Body>
        </Card>
    )

}

export default NoteForm;