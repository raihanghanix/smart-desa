import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import Cookies from "js-cookie";

const supabaseUrl = "https://acantvnikywedapuxefu.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function Login() {
  const navigate = useNavigate();
  const [nik, setNik] = useState("");
  const [pass, setPass] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nik || !pass) return alert("NIK dan Password tidak boleh kosong!");

    // CEK APAKAH NIK ADA DI DATABASE
    const getWarga = await supabase.from("users").select("*").eq("nik", nik);
    if (getWarga.data?.length === 0) return alert("NIK tidak terdaftar!");

    // CEK APAKAH PASSWORD SUDAH BENAR & LOGIN USER
    const loginUser = await supabase.from("users").select("*").eq("nik", nik);
    const isTheSame = bcrypt.compareSync(pass, loginUser.data[0]?.password);

    if (isTheSame) {
      if (Cookies.get("user")) {
        Cookies.remove("user");
      }
      Cookies.set("user", nik, { expires: 3 });
      navigate("/");
    } else alert("Password salah!");
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center p-4">
      <div className="p-8 border border-black shadow-md rounded-lg flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-neutral-600">
          Login menggunakan NIK dan Password Anda.
        </p>
        <form
          className="flex flex-col gap-2"
          method="POST"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="flex gap-2 items-center">
            <label className="w-[96px]" htmlFor="nik">
              NIK
            </label>
            <input
              className="w-full"
              type="text"
              name="nik"
              required
              maxLength={16}
              value={nik}
              onChange={(e) => setNik(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="w-[96px]" htmlFor="pass">
              Password
            </label>
            <input
              className="w-full"
              type="password"
              name="pass"
              required
              minLength={6}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button
            className="mt-2 py-2 px-4 bg-black text-white rounded-lg hover:scale-105"
            type="submit"
          >
            Login
          </button>
          <button
            className="mt-2 py-2 px-4 border border-black text-black rounded-lg hover:scale-105"
            type="submit"
            onClick={(e) => {
              setNik("1571071303040060");
              setPass("john123");
              const id = setTimeout(() => {
                handleSubmit(e);
              }, 200);
              clearTimeout(id);
            }}
          >
            Langsung Login sebagai Admin &rarr;
          </button>
          <button
            className="mt-2 py-2 px-4 border border-black text-black rounded-lg hover:scale-105"
            type="submit"
            onClick={(e) => {
              setNik("1571071303040069");
              setPass("123123");
              const id = setTimeout(() => {
                handleSubmit(e);
              }, 200);
              clearTimeout(id);
            }}
          >
            Langsung Login sebagai User &rarr;
          </button>
        </form>
        <p className="text-neutral-600 text-center">
          Belum register?{" "}
          <Link className="text-black" to="/register">
            Register di sini.
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
