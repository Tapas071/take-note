"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: Date;
  priority?: "low" | "medium" | "high";
  tags?: string[];
}

export default function NotesProfilePage() {
  const params = useParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    priority: "medium" as "low" | "medium" | "high",
    tags: "",
  });
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newNote,
          tags: newNote.tags.split(",").map((tag) => tag.trim()),
        }),
      });

      if (response.ok) {
        const createdNote = await response.json();
        setNotes([...notes, createdNote]);
        setNewNote({ title: "", content: "", priority: "medium", tags: "" });
      }
    } catch (error) {
      console.error("Failed to create note", error);
    }
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;

    try {
      const response = await fetch(`/api/notes/${editingNote._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingNote,
          tags:
            typeof editingNote.tags === "string"
              ? (editingNote.tags as string || "").split(",").map((tag) => tag.trim())
              : editingNote.tags,
        }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(
          notes.map((note) =>
            note._id === updatedNote._id ? updatedNote : note
          )
        );
        setEditingNote(null);
      }
    } catch (error) {
      console.error("Failed to update note", error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotes(notes.filter((note) => note._id !== noteId));
      }
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`/api/notes?userId=${params.id}`);
        if (response.ok) {
          const fetchedNotes = await response.json();
          setNotes(fetchedNotes);
        }
      } catch (error) {
        console.error("Failed to fetch notes", error);
      }
    };

    if (params.id) {
      fetchNotes();
    }
  }, [params.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-2xl mb-6 text-foreground">
          Notes for User {params.id ? params.id[0] : "Unknown"}
        </h2>

        {/* Note Creation/Editing Form */}
        <form
          onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
          className="space-y-4 mb-6"
        >
          <input
            type="text"
            placeholder="Note Title"
            value={editingNote ? editingNote.title : newNote.title}
            onChange={(e) =>
              editingNote
                ? setEditingNote({ ...editingNote, title: e.target.value })
                : setNewNote({ ...newNote, title: e.target.value })
            }
            required
            className="w-full px-3 py-2 border rounded-md bg-input text-foreground"
          />

          <textarea
            placeholder="Note Content"
            value={editingNote ? editingNote.content : newNote.content}
            onChange={(e) =>
              editingNote
                ? setEditingNote({ ...editingNote, content: e.target.value })
                : setNewNote({ ...newNote, content: e.target.value })
            }
            required
            className="w-full px-3 py-2 border rounded-md bg-input text-foreground h-32"
          />

          <div className="flex space-x-4">
            <select
              value={editingNote ? editingNote.priority : newNote.priority}
              onChange={(e) =>
                editingNote
                  ? setEditingNote({
                      ...editingNote,
                      priority: e.target.value as "low" | "medium" | "high",
                    })
                  : setNewNote({
                      ...newNote,
                      priority: e.target.value as "low" | "medium" | "high",
                    })
              }
              className="w-full px-3 py-2 border rounded-md bg-input text-foreground"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={
                editingNote ? editingNote.tags?.join(", ") || "" : newNote.tags
              }
              onChange={(e) =>
                editingNote
                  ? setEditingNote({
                      ...editingNote,
                      tags: e.target.value.split(","),
                    })
                  : setNewNote({ ...newNote, tags: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md bg-input text-foreground"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            {editingNote ? "Update Note" : "Create Note"}
          </button>

          {editingNote && (
            <button
              type="button"
              onClick={() => setEditingNote(null)}
              className="w-full py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors mt-2"
            >
              Cancel
            </button>
          )}
        </form>

        {/* Notes List */}
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note._id}
              className={`
                bg-secondary p-4 rounded-md 
                ${
                  note.priority === "high"
                    ? "border-2 border-destructive"
                    : note.priority === "medium"
                    ? "border-l-4 border-primary"
                    : ""
                }
              `}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {note.title}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingNote(note)}
                    className="text-primary hover:text-primary/80"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-muted-foreground text-sm">
                Created: {new Date(note.createdAt).toLocaleDateString()}
              </p>

              {note.tags && note.tags.length > 0 && (
                <div className="mt-2 flex space-x-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-2 text-foreground">{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
