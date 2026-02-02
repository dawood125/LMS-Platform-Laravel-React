import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../common/Layout";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { apiUrl } from "../common/Config";
import { AuthContext } from "../context/Auth";

const Login = () => {
    const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle registration logic here
    fetch(apiUrl + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200) {
            const userInfo={
                name: result.name,
                id: result.id,
                token: result.token
            }
            localStorage.setItem("userInfolms", JSON.stringify(userInfo));
            login(userInfo);
            navigate("/account/dashboard");
        } else {
          toast.error(result.message);
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        setError("general", {
          message: "Login failed. Please try again.",
        });
      });
  };

  return (
    <Layout>
      <div className="container py-5 mt-5">
        <div className="d-flex align-items-center justify-content-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card border-0 shadow login">
              <div className="card-body p-4">
                <h3 className="border-bottom pb-3 mb-3">Login</h3>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="Email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    placeholder="Password"
                    {...register("password", { required: "Password is required" })}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">
                      {errors.password.message}
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <button className="btn btn-primary">Login</button>
                  <Link to={`/account/register`} className="text-secondary">
                    Register Here
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
