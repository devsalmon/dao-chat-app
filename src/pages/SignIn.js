import React, { useState } from "react";
import Gun from "gun";
import "gun/sea";

function SignIn() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  // Database
  const gun = Gun({
    peers: ["http://localhost:3030/gun"],
  });
  const user = gun.user(); //.recall({ sessionStorage: true });

  // https://gun.eco/docs/User

  const signIn = () => {
    user.auth(username, password, ({ err }) => err && alert(err));
  };

  // Create user
  const signUp = () => {
    user.create(username, password, ({ err }) => {
      if (err) {
        alert(err);
      } else {
        signIn();
      }
    });
  };

  gun.on("auth", (ack) =>
    console.log(user.get("alias"), " authentication was successful: ", ack)
  );

  return (
    <>
      <label>
        Enter username:{" "}
        <input
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          name="name"
          value={username}
        />
      </label>
      <br />
      <label>
        Enter password:{" "}
        <input
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          name="message"
          value={password}
        />
      </label>
      <br />
      <button
        className="border-4 border-cyan-500 rounded-lg"
        onClick={() => signUp()}
      >
        Create User
      </button>
      <br />
      {/* <p>Username: {user.is && user.get("alias")}</p> */}
      <button
        className="border-4 border-cyan-500 rounded-lg"
        onClick={() => signIn()}
      >
        Sign In
      </button>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <p>Username: {username}</p>
      <p>Password: {password}</p>
    </>
  );
}

export default SignIn;
