import React from "react";
import Layout from "../common/Layout";
import Hero from "../common/Hero";
import FeaturedCategories from "../common/FeaturedCategories";
import FeaturedCourses from "../common/FeaturedCourses";

const Home = () => {
  return (
    <Layout>
      <Hero></Hero>
      <FeaturedCategories></FeaturedCategories>
      <FeaturedCourses></FeaturedCourses>
    </Layout>
  );
};

export default Home;
