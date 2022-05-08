import Link from "next/link";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import MainContent from "./content/main";
import EventContent from "./content/event";
import NoticeContent from "./content/notice";
import Image from "next/image";
import { FiMap } from "react-icons/fi";
import { MdEmojiEvents } from "react-icons/md";
import Sheet from "react-modal-sheet";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";
import { BiReset } from "react-icons/bi";
import {
  AiFillMessage,
  AiFillLeftCircle,
  AiFillRightCircle,
  AiOutlineLogout,
} from "react-icons/ai";
import { useWindowSize } from "script/hook";
import { ToastContainer } from "react-toastify";
import PopupPanelContinent from "./map/popupPannelContinent";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import {
  getComponentType,
  selectIsPanelOpen,
  setComponentType,
  setIsPanelOpen,
} from "features/loa/loaSlice";
import { useAppSelector, useAppDispatch } from "store";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import { Logout } from "@mui/icons-material";

export const useTabs = (initialTabs, allTabs) => {
  const [contentIndex, setContentIndex] = useState(initialTabs);
  return {
    contentItem: allTabs[contentIndex],
    contentChange: setContentIndex,
  };
};

export const useServer = (initialTabs, allTabs) => {
  const [contentIndex, setContentIndex] = useState(initialTabs);
  return {
    serverItem: allTabs[contentIndex],
    serverChange: setContentIndex,
  };
};

const snapPoints = [-50, 270, 0];

export default function MapLayer({
  server,
  data,
  notice,
  auth,
  user,
  siteMenu,
}) {
  const size = useWindowSize();
  const [cookies, setCookie, removeCookie] = useCookies(["rememberText"]);
  const router = useRouter();
  const modalRef = useRef();

  const isPanelOpen = useAppSelector(selectIsPanelOpen);
  const componentType = useAppSelector(getComponentType);
  const dispatch = useAppDispatch();

  const modalSnapControl = useCallback(() => {
    modalRef.current?.snapTo(1);
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // visibleEvent 지도명
  const menu = [
    {
      tab: "제보",
      key: 0,
      icon: <FiMap />,
      content: (
        <MainContent
          key="main"
          server={server}
          data={data}
          modalControl={modalSnapControl}
          auth={auth}
        />
      ),
    },
    {
      tab: "이벤트",
      key: 1,
      icon: <MdEmojiEvents />,
      content: <EventContent server={server} />,
    },
    {
      tab: "공지사항",
      key: 2,
      icon: <AiFillMessage />,
      content: <NoticeContent key="notice" data={notice} />,
    },
  ];
  const [hideContent, setHideContent] = useState(false);
  const [hideContentMobile, setHideContentMobile] = useState(false);

  const { contentItem, contentChange } = useTabs(0, menu);
  const close = () => dispatch(setIsPanelOpen(false));

  function hideContentLayer() {
    setHideContent((prevCheck) => !prevCheck);
  }

  function handleContentChange(key) {
    contentChange(key);
    setHideContent(false);
  }

  function handleMobileOpen(key) {
    dispatch(setComponentType(key));
    dispatch(setIsPanelOpen(true));
  }

  function getRouter(key) {
    if (server) {
      switch (key) {
        case 0:
          return `/server/${server}`;
          break;
        case 1:
          return `/event/${server}`;
          break;
        case 2:
          return `/notice/${server}`;
          break;
        default:
          return `/server/${server}`;
      }
    } else {
      switch (key) {
        case 0:
          return "/";
          break;
        case 1:
          return "/event";
          break;
        case 2:
          return "/notice";
          break;
        default:
          return "/";
      }
    }
  }

  useEffect(() => {
    switch (siteMenu) {
      case "main":
        handleContentChange(0);
        break;
      case "event":
        handleContentChange(1);
        break;
      case "notice":
        handleContentChange(2);
        break;
      default:
        handleContentChange(0);
    }
  }, []);

  useEffect(() => {
    if (size.width < 768 && !hideContentMobile) {
      setHideContent(true);
    }
    if (size.width > 768) {
      setHideContent(false);
    }
  }, [size]);

  return (
    <div
      className={`${hideContent ? "mapLayerControl mini" : "mapLayerControl"}`}
    >
      <div className="mapLayerControl_menu">
        <div className="mapMenu pc" onClick={() => hideContentLayer()}>
          {hideContent ? <AiFillRightCircle /> : <AiFillLeftCircle />}
          <p>{hideContent ? "메뉴 열기" : "메뉴 닫기"}</p>
        </div>
        {menu.map((item, index) => (
          <Link href={getRouter(index)}>
            <div
              className={`${
                contentItem.key == index ? "mapMenu pc active" : "mapMenu pc"
              }`}
              onClick={() => {
                handleContentChange(index);
              }}
              key={index}
            >
              {item.icon}
              <p>{item.tab}</p>
            </div>
          </Link>
        ))}

        <div className={auth && "mobile_loggin"}>
          <div
            className="mapMenu mobile"
            onClick={() => handleMobileOpen("report")}
          >
            <FiMap />
            <p>제보</p>
          </div>
          <div
            className="mapMenu mobile"
            onClick={() => handleMobileOpen("notice")}
          >
            <AiFillMessage />
            <p>공지</p>
          </div>
          <div
            className="mapMenu mobile"
            onClick={() => handleMobileOpen("event")}
          >
            <MdEmojiEvents />
            <p>이벤트</p>
          </div>
          <div
            className="mapMenu mobile"
            onClick={() => handleMobileOpen("quick")}
          >
            <BsFillArrowUpCircleFill />
            <p>빠른 이동</p>
          </div>

          {auth && (
            <div
              className="mapMenu mobile"
              onClick={() => {
                removeCookie("token");
                window.location.href = "/";
              }}
            >
              <AiOutlineLogout />
              <p>로그아웃</p>
            </div>
          )}
        </div>

        {/* mobile navigation end */}
      </div>
      <div
        className={`${
          hideContent
            ? "mapLayerControl_content hidden"
            : "mapLayerControl_content"
        }`}
      >
        <div className="mapLayerControl_content_title">
          <Box
            className="mapLayer_pc_top_bar"
            sx={{
              "& > div > div": {
                top: "10px",
                left: "10px",
                cursor: "pointer",
              },
              display: "flex",
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Link href="/">
                <Image
                  src="/logo.png"
                  width={130}
                  height={50}
                  priority
                  alt="logo"
                />
              </Link>
            </Box>
            {auth && (
              <IconButton
                size="small"
                onClick={handleClick}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                sx={{
                  justifyContent: "flex-end",
                  mr: 1,
                  mt: 1,
                }}
              >
                <Avatar sx={{ width: 39, height: 39, backgroundColor: "#333" }}>
                  {user.data.username.slice(0, 1)}
                </Avatar>
              </IconButton>
            )}
          </Box>
        </div>

        {contentItem.content}
      </div>

      {size.width < 768 && (
        <Sheet
          ref={modalRef}
          isOpen={isPanelOpen}
          snapPoints={snapPoints}
          onClose={() => dispatch(setIsPanelOpen(false))}
        >
          <Sheet.Container>
            <Sheet.Header />
            <div className="mapLayerControl_content_title">
              <div className="mapLayer_mobile_logo">
                <Link href="/">
                  <Image
                    src="/logo.png"
                    width={130}
                    height={50}
                    priority
                    alt="logo"
                  />
                </Link>
              </div>
              <div
                className="close_btn_mobile"
                onClick={() => {
                  modalRef.current?.snapTo(2);
                }}
              >
                <BsFillArrowDownCircleFill />
              </div>
            </div>
            <Sheet.Content disableDrag={true}>
              {componentType === "report" && (
                <MainContent
                  key="mobile_main"
                  server={server}
                  data={data}
                  modalControl={modalSnapControl}
                  auth={auth}
                />
              )}
              {componentType === "event" && <EventContent server={server} />}
              {componentType === "notice" && (
                <NoticeContent key="mobile_notice" data={notice} />
              )}
              {componentType === "quick" && (
                <PopupPanelContinent
                  key="mobile_quick"
                  modalSnapControl={modalSnapControl}
                />
              )}
            </Sheet.Content>
          </Sheet.Container>

          <Sheet.Backdrop onTap={close} />
        </Sheet>
      )}
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

      {auth && (
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem>
            <Avatar
              sx={{ width: 25, height: 25, backgroundColor: "#000", mr: 1 }}
            >
              {user.data.username.slice(0, 1)}
            </Avatar>{" "}
            <Box>{user.data.username} 님 환영합니다!</Box>
          </MenuItem>
          <Divider
            sx={{
              borderColor: "#646262",
            }}
          />
          <MenuItem
            onClick={() => {
              removeCookie("token");
              window.location.href = "/";
            }}
          >
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
              }}
            >
              로그아웃
            </Box>
          </MenuItem>
        </Menu>
      )}
    </div>
  );
}
