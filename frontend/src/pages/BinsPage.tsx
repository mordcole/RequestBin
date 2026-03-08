import { Link } from "react-router-dom";

const BinsPage = () => {
  return (
    <>
      <div>
        <h1>Bins</h1>
        <Link to="/bins/123">Go to Bin 123</Link>
      </div>
    </>
  );
};

export default BinsPage;
