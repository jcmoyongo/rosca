import { useEffect, useState } from "react";

export default function Dashboard({ onLogout }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState('');
  const [joinGroupId, setJoinGroupId] = useState('');

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/groups/my-groups", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setGroups(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ groupName: newGroupName })
      });

      console.log("Sending token:", token);

      const data = await res.json();
      if (res.ok) {
        setNewGroupName('');
        fetchGroups(); // ✅ refresh group list
      } else {
        alert(data.error || "Failed to create group");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinGroup = async () => {
    if (!joinGroupId) return;

    try {
      const res = await fetch("http://localhost:5000/api/groups/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ groupId: joinGroupId })
      });

      const data = await res.json();
      if (res.ok) {
        setJoinGroupId('');
        fetchGroups(); // ✅ refresh group list
      } else {
        alert(data.error || "Failed to join group");
      }
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/groups/my-groups", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        if (res.ok) {
          setGroups(data);
        } else {
          console.error(data.error || "Failed to fetch groups");
        }
      } catch (err) {
        console.error("Error fetching groups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [token]);

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Welcome to the ROSCA Dashboard 🎉</h2>
      <p>You are logged in as user ID: <strong>{userId}</strong></p>
      <button onClick={onLogout}>Logout</button>

      <hr />
      <h3>Your Groups</h3>
      {loading ? (
        <p>Loading groups...</p>
      ) : groups.length === 0 ? (
        <p>🛈 You don’t belong to any group yet.</p>
      ) : (
        <ul>
          {groups.map((group) => (
            <div>
              <li key={group.groupId}>📌 {group.groupName}</li>
              <h3>Members:</h3>
              <ul>
                {group.Users.map(user => (
                  <li key={user.id}>{user.username} ({user.email})</li>
                ))}
              </ul>
            </div>
          ))}
        </ul>
      )}

      <hr />
      <h3>Create New Group</h3>
      <input
        type="text"
        placeholder="Group name"
        value={newGroupName}
        onChange={(e) => setNewGroupName(e.target.value)}
      />
      <button onClick={handleCreateGroup}>Create</button>

      <hr />
      <h3>Join Existing Group</h3>
      <input
        type="text"
        placeholder="Group ID"
        value={joinGroupId}
        onChange={(e) => setJoinGroupId(e.target.value)}
      />
      <button onClick={handleJoinGroup}>Join</button>

    </div>
  );
}
