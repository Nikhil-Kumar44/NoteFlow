import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import { Search, Plus, FileText } from 'lucide-react';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const { user } = useAuth();

    const fetchNotes = async (search = '') => {
        try {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes${search ? `?search=${search}` : ''}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(res.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchNotes(searchQuery);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleCreateOrUpdate = async (noteData) => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            if (currentNote) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/notes/${currentNote._id}`, noteData, config);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/notes`, noteData, config);
            }
            
            setIsModalOpen(false);
            setCurrentNote(null);
            fetchNotes(searchQuery);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save note');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token;
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchNotes(searchQuery);
            } catch (err) {
                alert('Failed to delete note');
            }
        }
    };

    const openModal = (note = null) => {
        setCurrentNote(note);
        setIsModalOpen(true);
    };

    return (
        <div className="container">
            <div className="dashboard-header">
                <h2>My Notes</h2>
                <div className="search-bar">
                    <Search className="search-icon" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search notes..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={20} /> New Note
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading notes...</div>
            ) : notes.length > 0 ? (
                <div className="notes-grid">
                    {notes.map(note => (
                        <NoteCard 
                            key={note._id} 
                            note={note} 
                            onEdit={() => openModal(note)} 
                            onDelete={() => handleDelete(note._id)} 
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <FileText />
                    <h3>No notes found</h3>
                    <p>Get started by creating a new note.</p>
                    <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => openModal()}>
                        Create Note
                    </button>
                </div>
            )}

            {isModalOpen && (
                <NoteModal 
                    note={currentNote} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleCreateOrUpdate} 
                />
            )}
        </div>
    );
};

export default Dashboard;
