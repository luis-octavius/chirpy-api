import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <div className="flex items-center justify-around flex-col bg-white-900 h-full shadow-xl/30 bg-purple-600 round-xl">
      <div className="h-40 flex items-center">
        <h1 className="text-white text-4xl round-xl font-bold">Chirpy</h1>
      </div>

      <div className="h-[80%] flex flex-col gap-2 items-center">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </div>
    </div>
  );
}
