import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";

function SignIn({ gun, user }) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const signIn = () => {
    user.auth(username, password, ({ err }) => {
      if (err) alert(err);
    });
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

  return (
    <div className="flex flex-col gap-8 w-[400px] h-[600px] bg-gray-800 p-8 text-center">
      <div className="text-3xl text-white">Sign In</div>
      <div className="bg-white rounded-xl shadow-xl px-4 py-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label>Username</label>
          <Input
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            name="name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Password</label>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            name="message"
          />
        </div>
        <Button onClick={signUp}>Create User</Button>
        <Button onClick={signIn}>Sign In</Button>
      </div>
    </div>
  );
}

export default SignIn;
