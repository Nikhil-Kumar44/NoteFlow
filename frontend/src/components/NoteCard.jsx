import { Edit2, Trash2 } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete }) => {
    const formattedDate = new Date(note.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const authorName = note.userId && typeof note.userId === 'object' ? note.userId.name : null;

    return (
        <div className="note-card">
            <h3 className="note-title">{note.title}</h3>
            {authorName && (
                <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 500, 
                    color: 'var(--primary-color)', 
                    display: 'block', 
                    marginTop: '-0.5rem', 
                    marginBottom: '0.75rem' 
                }}>
                    By: {authorName}
                </span>
            )}
            <p className="note-content">{note.content}</p>
            <div className="note-footer">
                <span className="note-date">{formattedDate}</span>
                <div className="note-actions">
                    {onEdit && (
                        <button className="btn btn-ghost" onClick={onEdit} aria-label="Edit note" style={{ padding: '0.5rem' }}>
                            <Edit2 size={18} />
                        </button>
                    )}
                    <button className="btn btn-ghost" onClick={onDelete} aria-label="Delete note" style={{ padding: '0.5rem', color: 'var(--danger)' }}>
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
