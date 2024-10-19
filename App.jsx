import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [groups, setGroups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/groups')
            .then(response => {
                setGroups(response.data);
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
            });
    }, []);

    const handleSelectAll = () => {
        setSelectedGroups(groups.map(group => group.id));
    };

    const handleCheckboxChange = (id) => {
        setSelectedGroups(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(groupId => groupId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/send', {
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
                    rows="10"
                    cols="50"
                /><br /><br />
                <input type="submit" value="Send Message" />
            </form>
        </div>
    );
}

export default App;
