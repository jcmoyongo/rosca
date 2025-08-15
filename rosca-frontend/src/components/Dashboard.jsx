// Dashboard.jsx
import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Dashboard({ onLogout }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    setLoading(true);
    try {
      const res = await api.get("/groups");
      setGroups(res.data);
    } catch (err) {
      console.log("Error fetching groups XYZ:", err);
      console.error(err);
      setError("Failed to fetch groups.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateGroup(e) {
    e.preventDefault();
    if (!groupName) return;
    try {
      const res = await api.post("/groups", { group_name: groupName });
      setGroups(prev => [...prev, res.data]);
      setGroupName("");
      setShowCreateModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to create group.");
    }
  }

  async function handleJoinGroup(e) {
    e.preventDefault();
    if (!inviteToken) return;
    try {
      await api.post("/groups/join-by-invite", { inviteToken });
      setInviteToken("");
      setShowJoinModal(false);
      fetchGroups();
    } catch (err) {
      console.error(err);
      setError("Failed to join group. Check the token.");
    }
  }

  if (loading)
    return <p className="text-gray-500 text-center mt-10">Loading your groups...</p>;

  return (
    <div className="relative max-w-3xl w-full mx-auto p-6">
      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {groups.length === 0 ? (
        <div className="text-center space-y-4">
          <p className="text-gray-700">You have no groups yet.</p>
          <div className="space-x-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Create Group
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Join Group
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Groups</h2>
          <ul className="space-y-2 mb-4">
            {groups.map(group => (
              <li
                key={group.id}
                className="p-4 bg-gray-100 rounded shadow hover:bg-gray-200 transition"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{group.group_name}</p>
                  <div className="flex -space-x-2">
                    {group.users?.map(user => (
                      <img
                        key={user.id}
                        src={user.picture || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover"
                      />
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="space-x-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Create New Group
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Join Group
            </button>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md transform transition-transform duration-300 scale-95 opacity-0 animate-modalShow">
            <h3 className="text-xl font-semibold mb-4">Create Group</h3>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md transform transition-transform duration-300 scale-95 opacity-0 animate-modalShow">
            <h3 className="text-xl font-semibold mb-4">Join Group</h3>
            <form onSubmit={handleJoinGroup} className="space-y-4">
              <input
                type="text"
                placeholder="Invite Token"
                value={inviteToken}
                onChange={e => setInviteToken(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
