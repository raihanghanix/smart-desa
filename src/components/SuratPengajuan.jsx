import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import html2pdf from "html2pdf.js";
import { Link } from "react-router-dom";
import Terima from "./Terima";
import Spinner from "./Spinner";

const supabaseUrl = "https://acantvnikywedapuxefu.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function SuratPengajuan({ currUser, isAdmin, ketuaRt }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setIsSelected] = useState("default");
  const [inputValue, setInputValue] = useState({});
  const [url, setUrl] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [dataPengajuan, setDataPengajuan] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cari, setCari] = useState("");
  const [visble, setVisible] = useState(false);
  const [ttd, setTtd] = useState("");

  const opt = {
    margin: 1,
    filename: `${selected}-${currUser.nik}.pdf` || "file.pdf",
    image: { type: "jpeg", quality: 0.6 },
    html2canvas: { scale: 2 },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait",
      font: "times",
    },
  };

  function decideSelected() {
    if (selected === "spp") return "Penelitian";
    if (selected === "spk") return "Kematian";
    if (selected === "spd") return "Domisili";
    if (selected === "spmk") return "Mengurus KTP";
  }

  async function handleClick() {
    setIsOpen(true);
    setInputValue({});
    setKeterangan("");
  }

  function handleChange(e) {
    setInputValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (selected === "default") return console.log("Pilih yang lain!");
    const element = document.getElementById(`element-to-print-${selected}`);
    html2pdf()
      .set(opt)
      .from(element)
      .outputPdf("blob")
      .then((blobData) => {
        async function foo() {
          const randUUID = crypto.randomUUID();
          const insertData = await supabase.from("pengajuan").insert({
            nik: currUser.nik,
            nama: currUser.nama,
            kategori: decideSelected(),
            keterangan: keterangan,
            filename: `${selected}-${currUser.nik}-${randUUID}`,
            status: "Menunggu verifikasi",
          });
          const insertPdf = await supabase.storage
            .from("pdfs")
            .upload(`${selected}-${currUser.nik}-${randUUID}.pdf`, blobData, {
              cacheControl: "3600",
              upsert: false,
            });
          if (!insertData.error && !insertPdf.error) {
            setIsOpen(false);
            setIsSubmitted(true);
            setKeterangan("");
          }
        }
        foo();
      });
  }

  async function handleVer(e, filename) {
    if (e.target.name === "terima") {
      const alasan = prompt("Apakah anda yakin menerima pengajuan ini? y/n");
      if (alasan !== "y") return;
      const updateData = await supabase
        .from("pengajuan")
        .update({ status: "Diterima" })
        .eq("filename", filename);
      setIsSubmitted(true);
    }
    if (e.target.name === "tolak") {
      const alasan = prompt("Alasan anda menolak pengajuan ini:");
      if (!alasan) return;
      const updateData = await supabase
        .from("pengajuan")
        .update({ keterangan: `${alasan} (Admin)`, status: "Ditolak" })
        .eq("filename", filename);
      setIsSubmitted(true);
    }
  }

  async function handleTtd(e) {
    const type = e.type;
    if (type !== "image/png" && type !== "image/jpg" && type !== "image/jpeg") {
      setVisible(false);
      return alert("Format tidak didukung! (PNG, JPG atau JPEG < 200KB)");
    }
    if (Math.ceil(e.size / 1000) > 200) {
      setVisible(false);
      return alert("File terlalu besar! (Minimal 200KB)");
    }
    const query = await supabase.storage.from("images").update("ttd.jpg", e, {
      cacheControl: "3600",
      upsert: true,
    });
    const { data } = await supabase.storage
      .from("images")
      .getPublicUrl("ttd.jpg");
    setVisible(false);
  }

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setInputValue({});
        setKeterangan("");
      }
    });
    return document.removeEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setInputValue({});
        setKeterangan("");
      }
    });
  }, [currUser, isOpen]);

  useEffect(
    function () {
      const element = document.getElementById(`element-to-print-${selected}`);
      if (isOpen) {
        const id = setTimeout(() => {
          html2pdf()
            .set(opt)
            .from(element)
            .outputPdf("bloburl")
            .then((data) => setUrl(data));
        }, 1000);
        return () => clearTimeout(id);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected, inputValue]
  );

  useEffect(() => {
    async function getPengajuan() {
      if (isAdmin) {
        const getData = await supabase.from("pengajuan").select("*");
        setDataPengajuan(getData.data);
        return setIsSubmitted(false);
      }
      const getData = await supabase
        .from("pengajuan")
        .select("*")
        .eq("nik", currUser.nik);
      setDataPengajuan(getData.data);
      setIsSubmitted(false);
    }
    getPengajuan();
  }, [currUser.nik, isSubmitted, isAdmin]);

  useEffect(() => {
    async function getTtd() {
      setTtd("/ttd.jpg");
    }
    getTtd();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="">
        <h1 className="text-3xl font-bold">Surat Pengajuan</h1>
      </div>
      <div className="">
        <hr className="border border-neutral-600" />
      </div>
      npm
      <div className="w-full">
        {dataPengajuan.length > 0 ? (
          <table className="border-collapse w-full text-sm">
            <thead>
              <tr>
                <th>NIK</th>
                <th>Nama</th>
                <th>Surat Pengantar</th>
                <th>File</th>
                <th>Catatan</th>
                <th>Tanggal Diajukan</th>
                <th>Status</th>
                {isAdmin && <th>Aksi</th>}
                <th>Edit/Hapus</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(dataPengajuan).map((item) => (
                <tr key={item.id}>
                  <td>{item.nik}</td>
                  <td>{item.nama}</td>
                  <td>{item.kategori}</td>
                  <td>
                    {isAdmin && (
                      <Link
                        className="underline text-blue-600"
                        to={`https://acantvnikywedapuxefu.supabase.co/storage/v1/object/public/pdfs/${item.filename}.pdf`}
                        target="_blank"
                      >
                        {item.filename}
                        <i className="fa-solid fa-download ml-2"></i>
                      </Link>
                    )}
                    {!isAdmin && item.status === "Diterima" ? (
                      <Link
                        className="underline text-blue-600"
                        to={`https://acantvnikywedapuxefu.supabase.co/storage/v1/object/public/pdfs/${item.filename}.pdf`}
                        target="_blank"
                      >
                        {item.filename}
                        <i className="fa-solid fa-download ml-2"></i>
                      </Link>
                    ) : (
                      <p>{isAdmin ? "" : item.filename}</p>
                    )}
                  </td>
                  <td>{item.keterangan}</td>
                  <td>
                    {new Date(item.tanggal_diajukan).toLocaleString([
                      "ban",
                      "id",
                    ])}
                  </td>
                  <td>
                    <p
                      className={`py-2 px-3 rounded-lg text-white ${
                        item.status === "Diterima"
                          ? "bg-emerald-500"
                          : item.status === "Ditolak"
                          ? "bg-rose-500"
                          : "bg-amber-500"
                      }`}
                    >
                      {item.status}
                    </p>
                  </td>
                  {isAdmin && (
                    <td className="">
                      <div className="flex gap-2">
                        {item.status === "Ditolak" ? (
                          ""
                        ) : (
                          <button
                            className="flex-1 text-white rounded-lg bg-emerald-500 p-2 px-3"
                            name="terima"
                            onClick={(e) => handleVer(e, item.filename)}
                            disabled={
                              item.status === "Diterima" ||
                              item.status === "Ditolak"
                            }
                          >
                            {item.status === "Diterima" ? "Diterima" : "Terima"}
                          </button>
                        )}
                        {item.status === "Diterima" ? (
                          ""
                        ) : (
                          <button
                            className="flex-1 text-white rounded-lg bg-rose-500 p-2 px-3"
                            name="tolak"
                            onClick={(e) => handleVer(e, item.filename)}
                            disabled={
                              item.status === "Diterima" ||
                              item.status === "Ditolak"
                            }
                          >
                            {item.status === "Ditolak" ? "Ditolak" : "Tolak"}
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                  <td>
                    <div className="flex gap-2">
                      {item.status === "Menunggu verifikasi" && !isAdmin && (
                        <button className="flex-1">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                      )}
                      <button
                        className="flex-1"
                        onClick={async () => {
                          await supabase
                            .from("pengajuan")
                            .delete()
                            .eq("filename", item.filename);
                          await supabase.storage
                            .from("pdfs")
                            .remove([`${item.filename}.pdf`]);
                          setIsSubmitted(true);
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Tidak ada data pengajuan.</p>
        )}
      </div>
      {isOpen && (
        <div className="z-10 absolute top-0 left-0 flex justify-center items-center w-screen h-screen py-48 px-96">
          <div
            className="z-10 absolute bg-black w-full h-full opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>
          <form
            className="z-20 bg-white p-8 rounded-lg shadow-lg border border-black flex gap-8 w-full h-full"
            onSubmit={(e) => handleSubmit(e)}
            method="POST"
          >
            <div className="flex w-[312px] pr-4 flex-col gap-4 overflow-y-auto">
              <div className="flex justify-between items-center font-bold text-2xl">
                <h1 className="">Tambah Pengajuan</h1>
                <button onClick={() => setIsOpen(false)}>
                  <i className="fa-solid fa-circle-xmark"></i>
                </button>
              </div>
              <div className="">
                <hr className="border border-neutral-600" />
              </div>
              <select
                name="select"
                value={selected}
                onChange={(e) => setIsSelected(e.target.value)}
              >
                <option value="default">Pilh Kategori Surat</option>
                <option value="spp">Surat Pengantar Penelitian</option>
                <option value="spk">Surat Pengantar Kematian</option>
                <option value="spd">Surat Pengantar Domisili</option>
                <option value="spmk">Surat Pengantar Mengurus KTP</option>
              </select>
              <div className="flex flex-col gap-2">
                {selected === "spp" && (
                  <>
                    <input
                      type="text"
                      name="spp-pekerjaan"
                      onChange={(e) => handleChange(e)}
                      placeholder="Pekerjaan stakeholder..."
                      autoComplete="off"
                      required
                    />
                    <input
                      type="text"
                      name="spp-tempat"
                      onChange={(e) => handleChange(e)}
                      placeholder="Tempat penelitian..."
                      autoComplete="off"
                      required
                    />
                    <input
                      type="text"
                      name="spp-lokasi"
                      onChange={(e) => handleChange(e)}
                      placeholder="Lokasi tempat penelitian..."
                      autoComplete="off"
                      required
                    />
                    <input
                      type="text"
                      name="spp-deskripsi"
                      onChange={(e) => handleChange(e)}
                      placeholder="Deskripsi singkat penelitian..."
                      autoComplete="off"
                      required
                    />
                    <input
                      type="text"
                      name="spp-tanggal"
                      onChange={(e) => handleChange(e)}
                      placeholder="Tanggal penelitian..."
                      autoComplete="off"
                      required
                    />
                    <input
                      type="text"
                      name="spp-catatan"
                      onChange={(e) => setKeterangan(e.target.value)}
                      placeholder="Catatan tambahan..."
                      autoComplete="off"
                    />
                  </>
                )}
                {selected === "spk" && (
                  <>
                    <input
                      type="text"
                      name="spk-pemakaman"
                      onChange={(e) => handleChange(e)}
                      placeholder="Tempat pemakaman..."
                      autoComplete="off"
                      required
                    />
                    <input
                      type="text"
                      name="spk-lokasi"
                      onChange={(e) => handleChange(e)}
                      placeholder="Lokasi tempat pemakaman..."
                      autoComplete="off"
                      required
                    />
                    <input
                      type="text"
                      name="spk-nama"
                      onChange={(e) => handleChange(e)}
                      placeholder="Nama almarhum..."
                      autoComplete="off"
                      required
                    />
                    <input
                      type="text"
                      name="spk-umur"
                      onChange={(e) => handleChange(e)}
                      placeholder="Umur almarhum..."
                      autoComplete="off"
                      required
                    />
                    <input
                      type="text"
                      name="spk-kelamin"
                      onChange={(e) => handleChange(e)}
                      placeholder="Jenis kelamin almarhum..."
                      autoComplete="off"
                      required
                    />
                    <input
                      type="text"
                      name="spk-agama"
                      onChange={(e) => handleChange(e)}
                      placeholder="Agama almarhum..."
                      autoComplete="off"
                      required
                    />
                    <input
                      type="text"
                      name="spk-alamat"
                      onChange={(e) => handleChange(e)}
                      placeholder="Alamat almarhum..."
                      autoComplete="off"
                      required
                    />
                    <input
                      type="text"
                      name="spk-wafat"
                      onChange={(e) => handleChange(e)}
                      placeholder="Tanggal wafat..."
                      autoComplete="off"
                      required
                    />
                    <input
                      type="text"
                      name="spk-catatan"
                      onChange={(e) => setKeterangan(e.target.value)}
                      placeholder="Catatan tambahan..."
                      autoComplete="off"
                    />
                  </>
                )}
                {selected === "spd" && (
                  <>
                    <input
                      type="text"
                      name="spd-catatan"
                      onChange={(e) => setKeterangan(e.target.value)}
                      placeholder="Catatan tambahan..."
                      autoComplete="off"
                    />
                  </>
                )}
                {selected === "spmk" && (
                  <>
                    <input
                      type="text"
                      name="spmk-catatan"
                      onChange={(e) => setKeterangan(e.target.value)}
                      placeholder="Catatan tambahan..."
                      autoComplete="off"
                    />
                  </>
                )}
              </div>
              {selected !== "default" && (
                <button
                  className="bg-black text-white py-2 px-4 rounded-lg"
                  type="submit"
                >
                  Ajukan
                </button>
              )}
            </div>
            <section className="w-full h-full flex justify-center relative items-center">
              {selected !== "default" ? (
                <>
                  <div className="w-full h-[11%] z-10 top-0 left-0 absolute bg-[#323639]">
                    <div className="w-full h-full flex justify-center items-center text-white">
                      <h1>Preview</h1>
                    </div>
                  </div>
                  <div className="w-[98%] h-full z-10 top-0 left-0 absolute bg-black opacity-20">
                    <div className="w-full h-full flex justify-center items-center">
                      <h1 className="text-white font-bold text-9xl -rotate-45">
                        Preview
                      </h1>
                    </div>
                  </div>
                  <embed
                    src={url}
                    width="100%"
                    height="100%"
                    type="application/pdf"
                  />
                </>
              ) : (
                <h1 className="text-2xl font-bold animate-pulse">
                  Silahkan Pilih Kategori Surat...
                </h1>
              )}
            </section>
          </form>
        </div>
      )}
      <div className={`${visble ? "" : "hidden"}`}>
        <div className="absolute bottom-0 right-0 p-4">
          <div className="flex flex-col gap-2">
            <p>PNG, JPG dan JPG &lt; 200KB</p>
            <input
              className="shadow-lg"
              type="file"
              name="ttd"
              onChange={(e) => handleTtd(e.target.files[0])}
            />
          </div>
        </div>
      </div>
      <div className="hidden">
        <Test
          inputValue={inputValue}
          currUser={currUser}
          ketuaRt={ketuaRt}
          ttd={ttd}
        />
      </div>
    </div>
  );
}

function Test({ inputValue, currUser, ketuaRt, ttd }) {
  return (
    <>
      <div
        id="element-to-print-spp"
        className="font-serif font-[12px] leading-8"
      >
        <div className="whitespace-pre-wrap font-bold text-center">
          <p>
            RUKUN TETANGGA {currUser.rt} RUKUN WARGA {currUser.rw}
          </p>
          <p>
            KELURAHAN {currUser.kel_desa} KECAMATAN {currUser.kecamatan}
          </p>
          <p>KABUPATEN KOTA JAMBI</p>
          <p>SURAT PENGANTAR RT</p>
          <p>
            Nomor: {"0" + Math.floor(Math.random() * 900 + 100)}/RT-
            {currUser.rt}/ {new Date().getFullYear()}
          </p>
          <br />
        </div>
        <div className="whitespace-pre-wrap font-normal text-justify">
          <p>
            Yth. {inputValue["spp-pekerjaan"] || "[Pekerjaan stakeholder]"}{" "}
            {inputValue["spp-tempat"] || "[Tempat penelitian]"}
          </p>
          <p>{inputValue["spp-lokasi"] || "[Lokasi tempat penelitian]"}</p>
          <p>Di tempat</p>
          <p>Saya yang bertanda tangan, menyampaikan bahwa:</p>
          <div className="flex">
            <div className="w-[148px]">Nama</div>
            <div>
              :{" "}
              {currUser.nama
                .split(" ")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join(" ")}
            </div>
          </div>
          <div className="flex">
            <div className="w-[148px]">Umur</div>
            <div>
              :{" "}
              {new Date().getFullYear() -
                Number(currUser.tanggal_lahir.slice(6))}{" "}
              tahun
            </div>
          </div>
          <div className="flex">
            <div className="w-[148px]">Jenis Kelamin</div>
            <div>
              :{" "}
              {currUser.jenis_kelamin
                .split("-")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join("-")}
            </div>
          </div>
          <div className="flex">
            <div className="w-[148px]">Agama</div>
            <div>
              :{" "}
              {currUser.agama
                .split("-")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join("-")}
            </div>
          </div>
          <div className="flex">
            <div className="w-[148px]">Status Perkawinan</div>
            <div>
              :{" "}
              {currUser.status_kawin
                .split("-")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join("-")}
            </div>
          </div>
          <div className="flex">
            <div className="w-[148px]">Alamat</div>
            <div>
              :{" "}
              {currUser.alamat
                .split(" ")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join(" ")}
            </div>
          </div>
          <p>
            Warga yang memiliki identitas tersebut adalah warga kami dengan
            maksud untuk melakukan penelitian{" "}
            {inputValue["spp-deskripsi"] || "[Deskripsi singkat penelitian]"}{" "}
            {inputValue["spp-tempat"] || "[Tempat penelitian]"} dilaksanakan
            pada {inputValue["spp-tanggal"] || "[Tanggal penelitian]"}.
          </p>
          <p>
            Demikian surat pengantar ini supaya dapat dipergunakan sebagaimana
            sesuai mestinya.
          </p>
          <br />
        </div>
        <div className="whitespace-pre-wrap font-normal text-right">
          <p>
            {currUser.kecamatan
              .split(" ")
              .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
              .join(" ")}
            ,{" "}
            {new Date().toLocaleDateString(["ban", "id"], {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p>
            Ketua RT {currUser.rt} RW {currUser.rw}
          </p>
          <br />
          <br />
          <br />
          <p>
            {ketuaRt.nama
              .split(" ")
              .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
              .join(" ")}
          </p>
        </div>
        <div className="absolute bottom-6 right-0">
          <img src={"/ttd.jpg"} width={96} />
        </div>
      </div>

      <div
        id="element-to-print-spk"
        className="font-serif font-[12px] leading-8"
      >
        <div className="whitespace-pre-wrap font-bold text-center">
          <p>
            RUKUN TETANGGA {currUser.rt} RUKUN WARGA {currUser.rw}
          </p>
          <p>
            KELURAHAN {currUser.kel_desa} KECAMATAN {currUser.kecamatan}
          </p>
          <p>KABUPATEN KOTA JAMBI</p>
          <p>SURAT PENGANTAR RT</p>
          <p>
            Nomor: {"0" + Math.floor(Math.random() * 900 + 100)}/RT-
            {currUser.rt}/ {new Date().getFullYear()}
          </p>
          <br />
        </div>
        <div className="whitespace-pre-wrap font-normal text-justify">
          <p>
            Yth. Pengurus {inputValue["spk-pemakaman"] || "[Tempat pemakaman]"}
          </p>
          <p>{inputValue["spk-lokasi"] || "[Lokasi tempat pemakaman]"}</p>
          <p>Di tempat</p>
          <p>Saya yang bertanda tangan ini, menerangkan bahwa:</p>
          <div className="flex">
            <div className="w-[148px]">Nama</div>
            <div>: {inputValue["spk-nama"] || "[Nama almarhum]"}</div>
          </div>
          <div className="flex">
            <div className="w-[148px]">Umur</div>
            <div>: {inputValue["spk-umur"] || "[Umur almarhum]"}</div>
          </div>
          <div className="flex">
            <div className="w-[148px]">Jenis Kelamin</div>
            <div>
              : {inputValue["spk-kelamin"] || "[Jenis kelamin almarhum]"}
            </div>
          </div>
          <div className="flex">
            <div className="w-[148px]">Agama</div>
            <div>: {inputValue["spk-agama"] || "[Agama almarhum]"}</div>
          </div>
          <div className="flex">
            <div className="w-[148px]">Alamat</div>
            <div>: {inputValue["spk-alamat"] || "[Alamat almarhum]"}</div>
          </div>
          <p>
            Warga tersebut telah meninggal dunia pada{" "}
            {inputValue["spk-wafat"] || "[Tanggal wafat]"} dan dimakamkan di{" "}
            {inputValue["spk-pemakaman"] || "[Tempat pemakaman]"}. Maksud kami
            untuk memohon bantuan Saudara sehingga mempersiapkan makam yang
            bersangkutan.
          </p>
          <p>
            Demikian surat pengantar ini supaya dapat dipergunakan sebagaimana
            sesuai mestinya.
          </p>
          <br />
        </div>
        <div className="whitespace-pre-wrap font-normal text-right">
          <p>
            {currUser.kecamatan
              .split(" ")
              .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
              .join(" ")}
            ,{" "}
            {new Date().toLocaleDateString(["ban", "id"], {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p>
            Ketua RT {currUser.rt} RW {currUser.rw}
          </p>
          <br />
          <br />
          <br />
          <p>
            {ketuaRt.nama
              .split(" ")
              .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
              .join(" ")}
          </p>
        </div>
        <div className="absolute bottom-6 right-0">
          <img src="/ttd.jpg" width={96} />
        </div>
      </div>

      <div
        id="element-to-print-spd"
        className="font-serif font-[12px] leading-8"
      >
        <div className="whitespace-pre-wrap font-bold text-center">
          <p>
            PENGURUS RUKUN TETANGGA {currUser.rt} RUKUN WARGA {currUser.rw}
          </p>
          <p>
            KELURAHAN {currUser.kel_desa} KECAMATAN {currUser.kecamatan}
          </p>
          <p>KABUPATEN KOTA JAMBI</p>
          <p>SURAT PENGANTAR DOMISILI</p>
          <p>
            Nomor: {"0" + Math.floor(Math.random() * 900 + 100)}/RT-
            {currUser.rt}/ {new Date().getFullYear()}
          </p>
          <br />
        </div>
        <div className="whitespace-pre-wrap font-normal text-justify">
          <p>
            Yang bertanda tangan di bawah ini merupakan Ketua RT {currUser.rt}{" "}
            RW {currUser.rw} Kecamatan{" "}
            {currUser.kecamatan
              .split(" ")
              .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
              .join(" ")}
            , Kabupaten Kota Jambi bahwa:
          </p>
          <p>Saya yang bertanda tangan, menyampaikan bahwa:</p>
          <div className="flex">
            <div className="w-[164px]">Nama</div>
            <div>
              :{" "}
              {currUser.nama
                .split(" ")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join(" ")}
            </div>
          </div>
          <div className="flex">
            <div className="w-[164px]">Tempat, tanggal lahir</div>
            <div>
              :{" "}
              {currUser.tempat_lahir
                .split(" ")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join(" ")}
              {", "}
              {currUser.tanggal_lahir}
            </div>
          </div>
          <div className="flex">
            <div className="w-[164px]">Jenis Kelamin</div>
            <div>
              :{" "}
              {currUser.jenis_kelamin
                .split("-")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join("-")}
            </div>
          </div>
          <div className="flex">
            <div className="w-[164px]">Agama</div>
            <div>
              :{" "}
              {currUser.agama
                .split("-")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join("-")}
            </div>
          </div>
          <div className="flex">
            <div className="w-[164px]">Status Perkawinan</div>
            <div>
              :{" "}
              {currUser.status_kawin
                .split("-")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join("-")}
            </div>
          </div>
          <div className="flex">
            <div className="w-[164px]">Alamat</div>
            <div>
              :{" "}
              {currUser.alamat
                .split(" ")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join(" ")}
            </div>
          </div>
          <div className="flex">
            <div className="w-[164px]">Kewarganegaraan</div>
            <div>: {currUser.kewarganegaraan}</div>
          </div>
          <div className="flex">
            <div className="w-[164px]">Pekerjaan</div>
            <div>
              :{" "}
              {currUser.pekerjaan
                .split(" ")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join(" ")}
            </div>
          </div>
          <p>
            Warga tersebut benar merupakan warga yang berdomisili di alamat yang
            tersebut.
          </p>
          <p>Demikian surat dibuat untuk sesuai keperluan dan ketentuan.</p>
          <br />
          <div className="whitespace-pre-wrap font-normal text-right">
            <p>
              {currUser.kecamatan
                .split(" ")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join(" ")}
              ,{" "}
              {new Date().toLocaleDateString(["ban", "id"], {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>
              Ketua RT {currUser.rt} RW {currUser.rw}
            </p>
            <br />
            <br />
            <br />
            <p>
              {ketuaRt.nama
                .split(" ")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join(" ")}
            </p>
          </div>
        </div>
        <div className="absolute bottom-6 right-0">
          <img src="/ttd.jpg" width={96} />
        </div>
      </div>

      <div
        id="element-to-print-spmk"
        className="font-serif font-[12px] leading-8"
      >
        <div className="whitespace-pre-wrap font-bold text-center">
          <p>
            PENGURUS RUKUN TETANGGA {currUser.rt} RUKUN WARGA {currUser.rw}
          </p>
          <p>
            KELURAHAN {currUser.kel_desa} KECAMATAN {currUser.kecamatan}
          </p>
          <p>KABUPATEN KOTA JAMBI</p>
          <p>SURAT PENGANTAR RT</p>
          <p>
            Nomor: {"0" + Math.floor(Math.random() * 900 + 100)}/RT-
            {currUser.rt}/ {new Date().getFullYear()}
          </p>
          <br />
        </div>
        <div className="whitespace-pre-wrap font-normal text-justify">
          <p>
            Yang bertanda tangan di bawah ini merupakan Ketua RT {currUser.rt}{" "}
            RW {currUser.rw} Kecamatan{" "}
            {currUser.kecamatan
              .split(" ")
              .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
              .join(" ")}
            , Kabupaten Kota Jambi menerangkan:
          </p>
          <div className="flex">
            <div className="w-[164px]">Nama</div>
            <div>
              :{" "}
              {currUser.nama
                .split(" ")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join(" ")}
            </div>
          </div>
          <div className="flex">
            <div className="w-[164px]">Tempat, tanggal lahir</div>
            <div>
              :{" "}
              {currUser.tempat_lahir
                .split(" ")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join(" ")}
              {", "}
              {currUser.tanggal_lahir}
            </div>
          </div>
          <div className="flex">
            <div className="w-[164px]">Jenis Kelamin</div>
            <div>
              :{" "}
              {currUser.jenis_kelamin
                .split("-")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join("-")}
            </div>
          </div>
          <div className="flex">
            <div className="w-[164px]">Agama</div>
            <div>
              :{" "}
              {currUser.agama
                .split("-")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join("-")}
            </div>
          </div>
          <div className="flex">
            <div className="w-[164px]">Alamat</div>
            <div>
              :{" "}
              {currUser.alamat
                .split(" ")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join(" ")}
            </div>
          </div>
          <div className="flex">
            <div className="w-[164px]">Kewarganegaraan</div>
            <div>: {currUser.kewarganegaraan}</div>
          </div>
          <p>
            Adalah penduduk di Kecamatan{" "}
            {currUser.kecamatan
              .split(" ")
              .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
              .join(" ")}{" "}
            Kabupaten Kota Jambi. Adapun surat ini bermaksud sebagai pengantar
            untuk membuat Kartu Tanda Penduduk (KTP).
          </p>
          <p>
            Demikian surat dibuat untuk dipergunakan sesuai dengan ketentuan.
          </p>
          <br />
          <div className="whitespace-pre-wrap font-normal text-right">
            <p>
              {currUser.kecamatan
                .split(" ")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join(" ")}
              ,{" "}
              {new Date().toLocaleDateString(["ban", "id"], {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>
              Ketua RT {currUser.rt} RW {currUser.rw}
            </p>
            <br />
            <br />
            <br />
            <p>
              {ketuaRt.nama
                .split(" ")
                .map((item) => `${item[0]}${item.substring(1).toLowerCase()}`)
                .join(" ")}
            </p>
          </div>
        </div>
        <div className="absolute bottom-6 right-0">
          <img src="/ttd.jpg" width={96} />
        </div>
      </div>
    </>
  );
}

export default SuratPengajuan;
