import React from "react";
import NavbarNG from "./NavbarNG";
import "../styles/css/RatingPage.css";

type RatingPageProps = {
  children: React.ReactNode;
};

const RatingPage: React.FC<RatingPageProps> = ({ children }) => {
  return (
    <div className="rating-page">
      <NavbarNG></NavbarNG>
      {children}
    </div>
  );
};

export default RatingPage;
