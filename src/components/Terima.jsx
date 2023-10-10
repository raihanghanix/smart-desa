import { useState } from "react";

function Terima() {
  const [isVisible, setIsVisilbe] = useState(false);

  return (
    <div className="z-10 absolute top-0 left-0 flex justify-center items-center w-screen h-screen py-48 px-96">
      {isVisible && (
        <>
          <div
            className="z-10 absolute bg-black w-full h-full opacity-50"
            onClick={() => {}}
          ></div>
          <form
            className="z-20 bg-white p-8 rounded-lg shadow-lg border border-black flex gap-8 w-full h-full"
            onSubmit={(e) => {}}
            method="POST"
          >
            <h1>fu</h1>
          </form>
        </>
      )}
    </div>
  );
}

export default Terima;
