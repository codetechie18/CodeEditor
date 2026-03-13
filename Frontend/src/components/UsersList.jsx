import '../styles/users-list.css'

export default function UsersList({ users }) {
  return (
    <div className="users-list-container">
      <div className="users-header">
        <h3>Connected Users</h3>
        <span className="user-count">{users.length}</span>
      </div>
      <div className="users-list">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <p className="user-name">{user.name}</p>
              <p className="user-status">
                {user.isActive ? '🟢 Active' : '🔴 Away'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
