import React, { useState } from "react";
import { apiUrl } from "./Config";

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const response = await fetch(apiUrl + "/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        setCategories(result.data);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="section-2">
      <div className="container">
        <div className="section-title py-3  mt-4">
          <h2 className="h3">Explore Categories</h2>
          <p>
            Discover categories designed to help you excel in your professional
            and personal growth.
          </p>
        </div>
        <div className="row gy-3">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="col-6 col-md-6 col-lg-3">
                <div className="card shadow border-0">
                  <div className="card-body">
                    <a href="#">{category.name}</a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Loading categories...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
