import React from "react";
import BrowseByCategory from "../components/BrowseByCategory";

const CategoriesOverview = () => {
  return (
    <div>
      <h2>All Categories</h2>
      <BrowseByCategory layout="vertical" /> {/* vertical layout for side menu style */}
    </div>
  );
};

export default CategoriesOverview;
