import React, {useState} from 'react';
import styles from '../styles/Home.module.css';

const SessionDetails = ({session}) => {
    const [joined, setJoined] = useState(false);

    const handleClick = () => {
        // Toggle the state when the button is clicked
        event.preventDefault();
        if (joined) {
            session.currentParticipants--;
            setJoined(false);
        } else if (session.currentParticipants < session.maxParticipants) {
            setJoined(true);
            session.currentParticipants++;
        }
    };

    return (
        <a>
            <div className={styles.sessionDetails}>
                <div className={styles.infoBox}>
                    <p><strong>Session ID: </strong>{session.sessionID}</p>
                    <p><strong>Session Lead: </strong>{session.sessionLead}</p>
                    <p><strong>Class: </strong>{session.course}</p>
                    <p><strong>Current Participants: </strong>{session.currentParticipants}</p>
                    <p><strong>Max Participants: </strong>{session.maxParticipants}</p>
                    <p><strong>Duration: </strong>{session.expirationPeriod} minutes</p>
                </div>
                <div className={styles.locationContainer}>
                    <div className={styles.locationBox}>
                        <p className={styles.locationText}><strong>Location</strong></p>
                        <p><strong>{session.location}</strong></p>
                        <p><strong>Floor: </strong>{session.floor}</p>
                        <p><strong>Note: </strong>{session.comments}</p>
                    </div>
                    <button className={styles.join} onClick={handleClick} disabled={session.currentParticipants > session.maxParticipants}>
                        {joined ? 'Leave' : 'Join'}
                    </button>
                </div>
            </div>
        </a>
    )
}

export default SessionDetails