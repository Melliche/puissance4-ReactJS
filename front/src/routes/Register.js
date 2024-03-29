import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { REGISTER } from "../API/userRequest";
import { useMutation } from "@apollo/client";
import Header from "../components/Header";

export default function Register() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [updateUser, { data, loading, error }] = useMutation(REGISTER, {
    onCompleted() {
      navigate("/login");
    },
  });

  return (
    <>
      <Header></Header>
      <section className="flex items-center flex-col min-h-screen bg-gray-900 pt-10">
        <h1 className="text-white text-4xl m-8">Register</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUser({
              variables: {
                id: "",
                username: userName,
                email: email,
                password: password,
              },
            });
          }}
        >
          <p className="text-red-600 text-lg">
            {error && <span>{error.message}</span>}
          </p>
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium text-gray-900 text-white">
              UserName
            </label>
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="John"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            ></input>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium text-gray-900 text-white">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="john.doe@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            ></input>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium text-gray-900 text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="•••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            ></input>
          </div>

          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                value=""
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 bg-gray-700 border-gray-600 focus:ring-blue-600 ring-offset-gray-800"
                required
              ></input>
            </div>
            <label className="ml-2 text-lg font-medium text-white text-gray-900 text-gray-300">
              I agree with the{" "}
              <Link
                className="text-blue-600 hover:underline text-blue-500"
                to={"/register"}
              >
                terms and conditions
              </Link>
              .
            </label>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
          >
            Submit
          </button>
        </form>

        <Link to={"/login"} className="text-white text-lg my-6">
          Already have an account ?
        </Link>
      </section>
    </>
  );
}
