import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Spinner from "./Spinner";

const supabaseUrl = "https://acantvnikywedapuxefu.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function DaftarWarga() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    async function getWarga() {
      setIsLoading(true);
      try {
        const warga = await supabase.from("warga").select("*");
        setData(warga.data);
      } catch (err) {
        throw new Error(err);
      } finally {
        setIsLoading(false);
      }
    }
    getWarga();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="">
        <h1 className="text-3xl font-bold">Daftar Warga</h1>
      </div>
      <div className="">
        <hr className="border border-neutral-600" />
      </div>
      {isLoading ? (
        <div className="w-full h-full text-6xl flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="w-full h-full overflow-auto">
          <table className="border-collapse w-full text-sm">
            <thead>
              <tr>
                <th>NIK</th>
                <th>Nama</th>
                <th>Tempat Lahir</th>
                <th>Tanggal Lahir</th>
                <th>Jenis Kelamin</th>
                <th>Alamat</th>
                <th>RT</th>
                <th>RW</th>
                <th>Kelurahan/Desa</th>
                <th>Kecamatan</th>
                <th>Agama</th>
                <th>Status Perkawinan</th>
                <th>Pekerjaan</th>
                <th>Kewarganegaraan</th>
              </tr>
            </thead>
            <tbody>
              {data ? (
                <>
                  {Array.from(data).map((item) => (
                    <tr key={item.nik}>
                      <td>{item.nik}</td>
                      <td>{item.nama}</td>
                      <td>{item.tempat_lahir}</td>
                      <td>{item.tanggal_lahir}</td>
                      <td>{item.jenis_kelamin}</td>
                      <td>{item.alamat}</td>
                      <td>{item.rt}</td>
                      <td>{item.rw}</td>
                      <td>{item.kel_desa}</td>
                      <td>{item.kecamatan}</td>
                      <td>{item.agama}</td>
                      <td>{item.status_kawin}</td>
                      <td>{item.pekerjaan}</td>
                      <td>{item.kewarganegaraan}</td>
                    </tr>
                  ))}
                </>
              ) : (
                ""
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DaftarWarga;
