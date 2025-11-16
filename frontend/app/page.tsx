"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      name
      created_at
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_USERS);
  console.log({ data, loading, error });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul className="space-y-2">
        {data?.users.map((user: User) => (
          <li key={user.id} className="p-4 border rounded">
            <p className="font-semibold">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
