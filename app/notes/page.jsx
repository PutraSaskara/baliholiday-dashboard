// src/app/notes/page.jsx
"use client";

import NotesList from '@/components/notes/NotesList';

function NotesPage() {
  return (
    <div className="w-full">
      <NotesList />
    </div>
  );
}

export default NotesPage;
