import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import NoteCard from './ui/NoteCard';
import NoteEditor from './NoteEditor';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { noteApi } from '@/services/api';
import { toast } from 'sonner';

const NoteList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const data = await noteApi.getAll();
        setNotes(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast.error(
            "Failed to load notes. Please try again later.",
            {
                description: "There was an error fetching your notes. Please check your connection and try again."
                }
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [toast]);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

  const handleCreateNote = () => {
    setSelectedNote(undefined);
    setIsEditorOpen(true);
  };

  const handleSaveNote = (savedNote: Note) => {
    if (selectedNote) {
      // Update existing note in the list
      setNotes(notes.map(note => 
        note._id === savedNote._id ? savedNote : note
      ));
    } else {
      // Add new note to the list
      setNotes([savedNote, ...notes]);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await noteApi.delete(noteId);
      setNotes(notes.filter(note => note._id !== noteId));
      
      toast.success(
        "Note deleted successfully!",
        {
          description: "Your note has been removed.",
        }
      );
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error(
        "Failed to delete note.",
        {
          description: "There was an error deleting your note. Please try again."
        }
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Notes</h2>
      
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by title or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredNotes.length > 0 ? (
            filteredNotes.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                onClick={handleNoteClick}
                onDelete={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(note._id || '');
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-4">
              {searchTerm ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 text-right">
        <Button onClick={handleCreateNote}>Create New Note</Button>
      </div>

      <NoteEditor
        note={selectedNote}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
      />
    </div>
  );
};

export default NoteList;