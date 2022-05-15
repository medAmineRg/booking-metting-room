import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container not-found">
      <div>
        <p>404</p>
      </div>
      <div>
        <p>Ooops!!</p>
      </div>
      <div>
        <p>
          THAT PAGE DOESN'T EXIST OR IT'S UNAVAILABLE OR YOU DON'T HAVE
          AUTHORIZATION TO VIEW IT.
        </p>
      </div>
      <Link to={"/"} className="btn btn-reverse">
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
