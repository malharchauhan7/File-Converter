import React from "react";
import { FaGithubSquare } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="w-full h-10 mt-5 md:h-20 flex items-center justify-end">
      <div>
        <footer>
          <div className="m-10 hover:cursor-pointer  transition-colors duration-300 opacity-50 hover:scale-110 transition-all hover:opacity-100">
            <a
              href="https://github.com/malharchauhan7/File-Converter"
              target="_blank"
            >
              <FaGithubSquare color="white" size={30} />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
