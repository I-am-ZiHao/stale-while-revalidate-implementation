import { useEffect, useState } from "react";
import "./App.css";

const CACHE = {};

const fetchUser = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch(`https://reqres.in/api/users/${id}`);
  const json = await response.json();
  return json.data;
};

function App() {
  const [userId, setUserId] = useState("1");
  const [users, setUsers] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    (async () => {
      if (userId in CACHE) {
        setUsers(CACHE[userId]);
      }
      setIsFetching(true);
      const _users = await Promise.all([
        await fetchUser(userId),
        await fetchUser(Math.ceil(Math.random() * 5) + 7),
      ]);
      CACHE[userId] = _users;
      setUsers(_users);
      setIsFetching(false);
    })();
  }, [userId]);

  return (
    <div className="App">
      <header className="container">
        {users.length > 0 && (
          <>
            <strong>Cached User:</strong>
            <User user={users[0]} />
            <strong>Random User:</strong>
            <User user={users[1]} />
          </>
        )}

        <button onClick={() => setUserId((prev) => (prev === "1" ? "2" : "1"))}>
          {isFetching ? "Fetching..." : "Click to Fetch"}
        </button>
      </header>
    </div>
  );
}

const User = ({ user }) => (
  <div className="user-wrapper">
    <img src={user.avatar} alt={user.first_name} />
    <div className="user-info">
      <text>id: {user.id}</text>
      <text>
        name: {user.first_name} {user.last_name}
      </text>
    </div>
  </div>
);

export default App;
