function Modal({ setIsOpen, children }) {
  return (
    <div className="z-10 w-screen h-screen absolute flex justify-center items-center top-0 left-0">
      <div
        className="w-full h-screen bg-black opacity-50"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="z-20 p-8 bg-white rounded-lg shadow-lg border-black">
        123
      </div>
    </div>
  );
}

export default Modal;
