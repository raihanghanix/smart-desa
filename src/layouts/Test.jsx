function Test() {
  return (
    <div id="element-to-print" className="font-serif font-[12px] leading-8">
      <div className="whitespace-pre-wrap">
        <p className="font-bold text-center">123</p>
        <br />
      </div>
      <div className="whitespace-pre-wrap">
        <p className="font-normal text-justify">123</p>
        <br />
      </div>
      <div className="whitespace-pre-wrap">
        <p className="font-normal text-right">123</p>
        <br />
      </div>
    </div>
  );
}

export default Test;
