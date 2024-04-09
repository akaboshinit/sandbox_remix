import type { MetaFunction } from "@remix-run/node";
import {
  type CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
      <User />
    </div>
  );
}

const User = () => {
  const [user, setUser] = useState<CognitoUser | null>(null);

  console.log("user : ", user);

  return (
    <div>
      <ul>
        <h1>User</h1>
        <li>
          <button
            type="button"
            onClick={async () => {
              const user = await signUp({
                userName: "test",
                email: "akaboshinit@gmail.com",
                password: "Test-1234",
              });

              if (user) setUser(user);
            }}
          >
            login
          </button>
        </li>
        <li>
          <button type="button" onClick={logout}>
            logout
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => {
              const cognitoUser = userPool.getCurrentUser();
              console.log("cognitoUser : ", cognitoUser);
            }}
          >
            getCurrentUser
          </button>
        </li>
        <li>UserState: {user ? "login" : "logout"}</li>
        <li>Name: {user?.getUsername()}</li>
      </ul>
    </div>
  );
};

const poolData = {
  UserPoolId: "us-east-1_e7km8RtLk",
  ClientId: "6qbgs24iqsvnd3boni9cngpsi5",
};
const userPool = new CognitoUserPool(poolData);

const signUp = (args: {
  userName: string;
  email: string;
  password: string;
}): Promise<CognitoUser | null> => {
  // ユーザー作成に必要な値の配列
  const attributeList: CognitoUserAttribute[] = [];

  // ユーザー名
  const nameData = {
    Name: "name",
    Value: args.userName,
  };

  // Eメール
  const emailData = {
    Name: "email",
    Value: args.email,
  };

  const attributeName = new CognitoUserAttribute(nameData);
  const attributeEmail = new CognitoUserAttribute(emailData);

  attributeList.push(attributeName);
  attributeList.push(attributeEmail);
  //   attributeList.push(attributePhoneNumber);

  // SDKの関数が非同期じゃなかったので、非同期になるようにnew Promiseにする
  return new Promise<CognitoUser | null>((resolve, reject) =>
    userPool.signUp(
      args.userName,
      args.password,
      attributeList,
      [],
      (err, result) => {
        if (err) {
          console.error("err : ", err);
          reject(err);
          return;
        }
        const cognitoUser = result?.user;
        if (typeof cognitoUser === "undefined") {
          console.error("user undefined : ", cognitoUser);
          reject(cognitoUser);
          return;
        }
        console.log("Success!!!!!", "user : ", cognitoUser);
        resolve(cognitoUser);
      }
    )
  );
};

const logout = (): void => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
};
