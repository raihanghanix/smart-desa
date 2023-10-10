import { useState } from "react";
import Spinner from "./Spinner";

function Blog() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto">
      <div className="">
        <h1 className="text-3xl font-bold">Blog dan Promosi</h1>
      </div>
      <div className="">
        <hr className="border border-neutral-600" />
      </div>
      {isLoading ? (
        <div className="w-full h-full text-6xl flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <input
                className="w-full"
                type="text"
                name="search"
                placeholder="Cari..."
              />
            </div>
            <div className="flex-initial">
              <button className="bg-black text-white py-2 px-4 rounded-lg hover:scale-105">
                Tambah Postingan
              </button>
            </div>
          </div>
          <div className="w-full h-full">
            <div className="flex flex-col gap-4">
              {/* LOOP HERE */}
              <div className="border border-black shadow-lg flex">
                <div className="flex-initial">
                  <img
                    className="aspect-video object-contain w-[384px] h-full"
                    src="/lambang.png"
                    alt="image"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-2xl">Blog Title</h1>
                    <p className="text-neutral-600">ADI ADIANTO (Postingan)</p>
                    <p>10/10/2023 08.00</p>
                  </div>
                  <div className="">
                    <hr className="border border-neutral-600" />
                  </div>
                  <div className="line-clamp-6">
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Assumenda officia ea, magni, dolorum eaque omnis
                      laboriosam dignissimos veniam reiciendis esse, enim harum
                      ipsam! Nisi laudantium recusandae earum impedit animi
                      eligendi iure vel nulla, facere voluptatem labore
                      exercitationem fugiat iusto fuga voluptatibus quas
                      voluptates cum qui vero, rerum consectetur. Accusamus
                      commodi nisi laborum expedita, maiores consequuntur sint
                      quas sed excepturi explicabo. Voluptatum hic, totam, iusto
                      ullam unde culpa minus enim, consequuntur incidunt nihil
                      voluptatem id! Adipisci in tempore officia incidunt
                      consectetur voluptatem dolor molestias labore quod
                      doloremque! Vel sed deleniti autem, debitis repudiandae
                      velit totam minima quaerat provident quibusdam dolore at
                      est neque quam architecto fugiat ratione eos ea
                      dignissimos quo distinctio, voluptatibus illum ab
                      molestias. Temporibus veritatis minus porro voluptatum
                      repudiandae dicta alias, commodi vitae! Facere dolores
                      nulla fugit iste, consequuntur at dicta. Minima molestias
                      nostrum magni quisquam quas, accusamus similique sunt
                      architecto sit voluptatum repudiandae distinctio fugit nam
                      alias rerum quos? Illo numquam cupiditate ullam temporibus
                      porro obcaecati cum, quasi, dignissimos maiores placeat,
                      architecto esse neque. Perferendis tempore error nulla
                      possimus aliquid enim cupiditate ducimus quod quis non,
                      voluptate totam odit provident libero et similique saepe
                      veniam. Tenetur reprehenderit autem est corrupti quod vero
                      repellat totam ullam corporis sit.
                    </p>
                  </div>
                  <a className="text-blue-500 underline" href="">
                    Baca selengkapnya...
                  </a>
                  <div className="flex gap-2">
                    <p className="text-white bg-blue-500 w-max p-4 rounded-lg">
                      <i className="fa-solid fa-pen-to-square   mr-2"></i>
                      Edit
                    </p>
                    <p className="text-white bg-rose-500 w-max p-4 rounded-lg">
                      <i className="fa-solid fa-trash mr-2"></i>
                      Hapus
                    </p>
                  </div>
                </div>
              </div>
              <div className="border border-black shadow-lg flex">
                <div className="flex-initial">
                  <img
                    className="aspect-video object-contain w-[384px] h-full"
                    src="/vite.svg"
                    alt="image"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-2xl">Blog Title</h1>
                    <p className="text-neutral-600">JOHN DOE (Promosi)</p>
                    <p>10/10/2023 08.00</p>
                  </div>
                  <div className="">
                    <hr className="border border-neutral-600" />
                  </div>
                  <div className="line-clamp-6">
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Assumenda officia ea, magni, dolorum eaque omnis
                      laboriosam dignissimos veniam reiciendis esse, enim harum
                      ipsam! Nisi laudantium recusandae earum impedit animi
                      eligendi iure vel nulla, facere voluptatem labore
                      exercitationem fugiat iusto fuga voluptatibus quas
                      voluptates cum qui vero, rerum consectetur. Accusamus
                      commodi nisi laborum expedita, maiores consequuntur sint
                      quas sed excepturi explicabo. Voluptatum hic, totam, iusto
                      ullam unde culpa minus enim, consequuntur incidunt nihil
                      voluptatem id! Adipisci in tempore officia incidunt
                      consectetur voluptatem dolor molestias labore quod
                      doloremque! Vel sed deleniti autem, debitis repudiandae
                      velit totam minima quaerat provident quibusdam dolore at
                      est neque quam architecto fugiat ratione eos ea
                      dignissimos quo distinctio, voluptatibus illum ab
                      molestias. Temporibus veritatis minus porro voluptatum
                      repudiandae dicta alias, commodi vitae! Facere dolores
                      nulla fugit iste, consequuntur at dicta. Minima molestias
                      nostrum magni quisquam quas, accusamus similique sunt
                      architecto sit voluptatum repudiandae distinctio fugit nam
                      alias rerum quos? Illo numquam cupiditate ullam temporibus
                      porro obcaecati cum, quasi, dignissimos maiores placeat,
                      architecto esse neque. Perferendis tempore error nulla
                      possimus aliquid enim cupiditate ducimus quod quis non,
                      voluptate totam odit provident libero et similique saepe
                      veniam. Tenetur reprehenderit autem est corrupti quod vero
                      repellat totam ullam corporis sit.
                    </p>
                  </div>
                  <a className="text-blue-500 underline" href="">
                    Baca selengkapnya...
                  </a>
                  <div className="flex gap-2">
                    <p className="text-white bg-emerald-500 w-max p-4 rounded-lg flex-1">
                      <i className="fa-brands fa-whatsapp mr-2"></i>
                      082320426161
                    </p>
                    <p className="text-white bg-blue-500 w-max p-4 rounded-lg">
                      <i className="fa-solid fa-pen-to-square   mr-2"></i>
                      Edit
                    </p>
                    <p className="text-white bg-rose-500 w-max p-4 rounded-lg">
                      <i className="fa-solid fa-trash mr-2"></i>
                      Hapus
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Blog;
