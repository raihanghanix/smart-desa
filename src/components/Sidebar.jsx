import Cookies from "js-cookie";
import { useNavigate } from "react-router";

function Sidebar({ currUser, isAdmin, selected, setSelected }) {
  const navigate = useNavigate();

  function handleClick() {
    const confirmation = prompt("Apakah Anda ingin logout? y/n");
    if (confirmation === "y") {
      Cookies.remove("user");
      navigate("/login");
    } else return;
  }

  return (
    <aside className="h-full w-[312px] p-8 bg-black flex flex-col gap-4 text-white">
      <div className="">
        <h1 className="font-bold text-3xl">SuPer.io</h1>
      </div>
      <div className="">
        <hr className="border border-neutral-600" />
      </div>
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
        <button
          onClick={() => setSelected(1)}
          className={`text-start py-2 px-4 border-2 border-white rounded-lg hover:bg-white hover:text-black ${
            selected === 1 ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          <i className="fa-solid fa-file-pen mr-2 w-[24px]"></i>
          Surat Pengajuan
        </button>
        {isAdmin && (
          <button
            onClick={() => setSelected(2)}
            className={`text-start py-2 px-4 border-2 border-white rounded-lg hover:bg-white hover:text-black ${
              selected === 2 ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            <i className="fa-solid fa-user mr-2 w-[24px]"></i>
            Daftar Warga
          </button>
        )}
        <button
          onClick={() => setSelected(3)}
          className={`text-start py-2 px-4 border-2 border-white rounded-lg hover:bg-white hover:text-black ${
            selected === 3 ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          <i className="fa-solid fa-message mr-2 w-[24px]"></i>
          Blog dan Promosi
        </button>
      </div>
      <div className="">
        <hr className="border border-neutral-600" />
      </div>
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex gap-2 items-center">
          <div className="bg-white text-black font-bold rounded-full w-[32px] h-[32px] flex justify-center items-center p-2">
            {currUser?.nama?.split(" ")[0][0] || ""}
            {currUser?.nama?.split(" ")[1][0] || ""}
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="line-clamp-2 text-sm">
              {currUser.nama}{" "}
              {isAdmin ? (
                <span className="text-sm text-neutral-600">(Admin)</span>
              ) : (
                <span className="text-sm text-neutral-600">(User)</span>
              )}{" "}
            </h1>
          </div>
        </div>
        <button
          className="w-full text-start text-black bg-white py-2 px-4 rounded-lg hover:scale-105"
          onClick={() => handleClick()}
        >
          <i className="fa-solid fa-right-to-bracket mr-3"></i>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
