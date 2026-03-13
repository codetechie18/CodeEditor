import '../styles/users-list.css'

export default function UsersList({ users = [] }) {
  return (
    <div className="users-list-container">
      <div className="users-header">
        <h3>Connected Users</h3>
        <span className="user-count">{users.length}</span>
      </div>
      <div className="users-list">
        {users.map((user, index) => {
          // Check karein ki name hai ya username, varna 'Anonymous' use karein
          const displayName = user.username || user.name || 'Anonymous';
          
          // CharAt error se bachne ke liye safe extraction
          const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

          return (
            <div key={user.socketId || user.id || index} className="user-item">
              <div className="user-avatar">
                {initial}
              </div>
              <div className="user-info">
                <p className="user-name">{displayName}</p>
                <p className="user-status">
                  {/* Agar real-time status nahi hai toh connected dikhayein */}
                  {user.isActive !== undefined 
                    ? (user.isActive ? '🟢 Active' : '🔴 Away') 
                    : '🟢 Connected'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}