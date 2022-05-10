import { useEffect } from "react";
import { useState } from "react";

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const [activeClass, setActiveClass] = useState(1);
  useEffect(() => {
    paginate(activeClass);
  }, [activeClass, paginate]);
  return (
    <nav>
      <ul className="pagination">
        <li className="page-item">
          <a
            onClick={(e) => {
              e.preventDefault();
              if (activeClass < pageNumbers.length) {
                setActiveClass(activeClass + 1);
              }
            }}
            href="!#"
          >
            Next
          </a>
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a
              onClick={(e) => {
                e.preventDefault();
                setActiveClass(number);
              }}
              className={number === activeClass ? "active" : ""}
              href="!#"
            >
              {number}
            </a>
          </li>
        ))}
        <li className="page-item">
          <a
            onClick={(e) => {
              e.preventDefault();
              if (activeClass > 1) {
                setActiveClass(activeClass - 1);
              }
            }}
            href="!#"
          >
            Previous
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
