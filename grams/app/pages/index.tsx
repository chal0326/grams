import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define interface for Group data structure
interface Group {
    id: number;
    title: string;
}

const Home: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
    const [message, setMessage] = useState<string>('');

    // Fetch list of groups when the component is first rendered
    useEffect(() => {
        axios.get('/api/groups')
            .then(response => {
                setGroups(response.data);
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
            });
    }, []);

    // Select all groups when the button is clicked
    const handleSelectAll = () => {
        setSelectedGroups(groups.map(group => group.id));
    };

    // Toggle selection for a specific group
    const handleCheckboxChange = (id: number) => {
        setSelectedGroups(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(groupId => groupId !== id) // Remove if already selected
                : [...prevSelected, id] // Add if not already selected
        );
    };

    // Handle form submission to send the message to selected groups
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post('/api/send', {
            groups: selectedGroups,
            message: message
        })
            .then(response => {
                alert(response.data.status);
            })
            .catch(error => {
                alert('Failed to send messages. Please try again later.');
                console.error(error);
            });
    };

    return (
        <div>
            <h1>Telegram Message Sender</h1>
            <h2>Available Groups</h2>
            <button type="button" onClick={handleSelectAll}>Select All</button>
            <form onSubmit={handleSubmit}>
                <ul>
                    {groups.map(group => (
                        <li key={group.id}>
                            <input
                                type="checkbox"
                                checked={selectedGroups.includes(group.id)}
                                onChange={() => handleCheckboxChange(group.id)}
                            />
                            {group.title}
                        </li>
                    ))}
                </ul>
                <label htmlFor="message">Enter Message:</label><br />
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={10}
                    cols={50}
                /><br /><br />
                <input type="submit" value="Send Message" />
            </form>
        </div>
    );
};

export default Home;
