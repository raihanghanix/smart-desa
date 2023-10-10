import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createClient } from "@supabase/supabase-js";
import Spinner from "../components/Spinner";
import Sidebar from "../components/Sidebar";
import SuratPengajuan from "../components/SuratPengajuan";
import Blog from "../components/Blog";
import DaftarWarga from "../components/DaftarWarga";

const supabaseUrl = "https://acantvnikywedapuxefu.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function Home() {
  const navigate = useNavigate();
  const [currUser, setCurrUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selected, setSelected] = useState(0);
  const [ketuaRt, setKetuaRt] = useState({});

  useEffect(() => {
    if (!Cookies.get("user")) return navigate("/login");
    async function getUsers() {
      setIsLoading(true);
      try {
        const user = await supabase
          .from("warga")
          .select("*")
          .eq("nik", Cookies.get("user"));
        const userType = await supabase
          .from("users")
          .select("*")
          .eq("nik", Cookies.get("user"));
        const ketua = await supabase
          .from("warga")
          .select("*")
          .eq("pekerjaan", "KETUA RT");
        if (userType.data[0].tipe === "admin") setIsAdmin(true);
        setCurrUser(user.data[0]);
        setKetuaRt(ketua.data[0]);
      } catch (err) {
        throw new Error(err);
      } finally {
        setIsLoading(false);
        setSelected(1);
      }
    }
    getUsers();
  }, [navigate]);

  return (
    <div className="w-screen h-screen">
      {isLoading && currUser ? (
        <div className="w-full h-screen text-6xl flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="w-full h-full flex">
          <Sidebar
            currUser={currUser}
            isAdmin={isAdmin}
            selected={selected}
            setSelected={setSelected}
          />
          <div className="w-full h-full p-8">
            {selected === 1 && (
              <SuratPengajuan
                currUser={currUser}
                isAdmin={isAdmin}
                ketuaRt={ketuaRt}
              />
            )}
            {selected === 2 && isAdmin && <DaftarWarga />}
            {selected === 3 && <Blog isAdmin={isAdmin} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
