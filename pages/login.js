import Link from "next/link";
import Image from "next/image";
import styled from "./styled.module.css";
import { useInput } from "./signup";
import { login } from "lib/auth";
import { useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AppContext from "context/AppContext";

import { useFormik } from "formik";
import { Box, Button } from "@mui/material";

function LoginPage() {
  const appContext = useContext(AppContext);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      loginHandler(values.username, values.password);
    },
  });

  if (appContext.user) {
    window.location.href = "/";
  }

  function loginHandler(email, password) {
    login(email, password)
      .then((res) => {
        appContext.setUser(res.data.user);
      })
      .catch((e) => {
        toast("다시 시도해주세요", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  }

  return (
    <div className={styled.wrapper}>
      <div className={styled.logo}>
        <a href="/">
          <Image src="/logo.png" width={130} height={50} priority alt="logo" />
        </a>
      </div>
      <div className={styled.title}>로그인</div>
      <Box
        component="form"
        className={styled.formWrap}
        onSubmit={formik.handleSubmit}
      >
        <div className={styled.inputWrap}>
          <input
            autoFocus
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            type="text"
            placeholder="닉네임 혹은 이메일"
            required
          />
        </div>
        <div className={styled.inputWrap}>
          <input
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            type="password"
            placeholder="비밀번호"
            required
          />
        </div>
        <Button
          type="submit"
          className={styled.actionButton}
          sx={{
            backgroundColor: "#1976d2",
            color: "#fff",
            ":hover": {
              bgcolor: "#2a4d97",
            },
          }}
        >
          로그인
        </Button>
        <div className={styled.infoWrap}>
          계정이 없으신가요?{" "}
          <Link href="/signup">
            <a>가입하기</a>
          </Link>
        </div>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default LoginPage;
