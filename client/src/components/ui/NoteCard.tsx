import React from 'react';
import { Note } from '../../types';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onClick, onDelete }) => {
  return (
    <Card 
      className="h-full cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(note)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold truncate">{note.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {note.content}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-end">
        <div className="flex flex-wrap gap-1">
          {note.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900"
          onClick={onDelete}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;