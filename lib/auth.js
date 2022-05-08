import { useEffect } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import API from "api";

export const registerUser = (username, email, password) => {
  if (typeof window === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    API.post(`/auth/local/register`, { username, email, password })
      .then((res) => {
        Cookie.set("token", res.data.jwt);
        resolve(res);
        window.location.href = "/";
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const login = (identifier, password) => {
  //prevent function from being ran on the server
  if (typeof window === "undefined") {
    return;
  }

  return new Promise((resolve, reject) => {
    API.post(`/auth/local/`, { identifier, password })
      .then((res) => {
        //set token response from Strapi for server validation
        Cookie.set("token", res.data.jwt);

        //resolve the promise to set loading to false in SignUp form
        resolve(res);
        //redirect back to home page for restaurance selection
        window.location.href = "/";
      })
      .catch((error) => {
        //reject the promise and pass the error object back to the form
        reject(error);
      });
  });
};

export const logout = () => {
  //remove token and user cookie
  Cookie.remove("token");
  delete window.__user;
  // sync logout between multiple windows
  window.localStorage.setItem("logout", Date.now());
  //redirect to the home page
  window.location.href = "/";
};
