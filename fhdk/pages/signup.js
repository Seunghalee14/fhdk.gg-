import React, { useContext } from "react";
import Link from "next/link";
import Modal from "@mui/material/Modal";
import styled from "./styled.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import API from "api";
import Image from "next/image";
import { registerUser } from "lib/auth";

import { useFormik } from "formik";

import AppContext from "context/AppContext";

const randomStr = Math.random().toString(36).substr(2, 11);

function SignUpPage() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const appContext = useContext(AppContext);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
      stoveID: "",
    },
    onSubmit: async (values) => {
      signupHandler(values.username, values.email, values.password);
    },
  });

  const [auth, setAuth] = React.useState(false);

  async function authHandler() {
    if (formik.values.stoveID.length > 0) {
      const res = await API.post(`/stoves`, {
        stoveID: formik.values.stoveID,
        authCode: randomStr,
      }).catch((e) => {
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

      setAuth(res.data.auth);
    } else {
      toast("스토브 ID 를 입력해주세요", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  function signupHandler(username, email, password) {
    if (auth) {
      registerUser(username, email, password)
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
    } else {
      toast("인증을 완료해주세요", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  // const randomStr = Math.random().toString(36).substr(2, 11);
  return (
    <div className={styled.wrapper}>
      <div className={styled.logo}>
        <a href="/">
          <Image src="/logo.png" width={130} height={50} priority alt="logo" />
        </a>
      </div>
      <div className={styled.title}>회원가입</div>

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
            placeholder="닉네임"
            required
          />
        </div>
        <div className={styled.inputWrap}>
          <input
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            type="email"
            placeholder="이메일"
            required
          />
        </div>
        <div className={styled.inputWrap}>
          <input
            name="stoveID"
            value={formik.values.stoveID}
            onChange={formik.handleChange}
            type="text"
            placeholder="스토브 ID"
            required
          />
        </div>
        <div className={styled.infoWrapCode}>
          {formik.values.stoveID.length < 8 ? (
            <>https://timeline.onstove.com/{"{아이디}"}</>
          ) : (
            <a
              className={styled.link}
              target="_blank"
              href={`https://timeline.onstove.com/${formik.values.stoveID}`}
            >
              https://timeline.onstove.com/{formik.values.stoveID}
            </a>
          )}
        </div>

        {!auth ? (
          <div className={`${styled.inputWrapF}`}>
            <input
              type="text"
              value={randomStr}
              placeholder="스토브 인증"
              disabled
            />
            <div className={styled.check} onClick={authHandler}>
              인증하기
            </div>
          </div>
        ) : (
          <div className={styled.finBox}>인증 완료</div>
        )}

        <div className={styled.infoWrapCode}>
          스토브 소개란에 다음 코드를 저장해주세요!{" "}
          <Tooltip title="도움말 보기" placement="bottom">
            <b onClick={handleOpen}>도움말</b>
          </Tooltip>
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
        {/* <div className={styled.actionButton} onClick={signupHandler}>
          회원가입
        </div> */}
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
          회원가입
        </Button>
        <div className={styled.infoWrap}>
          이미 계정이 있으신가요?{" "}
          <Link href="/login">
            <a>로그인</a>
          </Link>
        </div>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styled.modal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            스토브 인증하기
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            스토브 인증 방법은 다음과 같습니다.
          </Typography>
          <div
            style={{
              width: "100%",
              height: "100px",
              position: "relative",
              marginTop: "10px",
            }}
          >
            <Image
              src="/help/stove_main1.png"
              layout="fill"
              priority
              alt="logo"
            />
          </div>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            우측 톱니바퀴를 클릭하여 설정페이지로 이동합니다.
          </Typography>
          <div
            style={{
              width: "100%",
              height: "200px",
              position: "relative",
              marginTop: "10px",
            }}
          >
            <Image
              src="/help/stove_main2.png"
              layout="fill"
              priority
              alt="logo"
            />
          </div>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            소개 페이지에 있는 발급 받은 코드를 입력 후 저장합니다.
          </Typography>
        </Box>
      </Modal>
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

export default SignUpPage;
