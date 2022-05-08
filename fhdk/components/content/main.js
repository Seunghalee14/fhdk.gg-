import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { useServer, useTabs } from "@components/map_layer";
import MainTabContent from "@components/tab/main";
import ReportTabContent from "@components/tab/report";
import { toast } from "react-toastify";
import { UseCookie } from "../../cookie";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { getClosestData } from "lib/parse";
import API from "api";
import "react-toastify/dist/ReactToastify.css";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

function MainContent(props) {
  const { server, data, modalControl, auth } = props;
  const [isUpdate, setIsUpdate] = useState(false);
  const [isEventTime, setIsEventTime] = useState(false);
  const [serverSelect, setServerSelect] = useState("");
  const [cookieServer, setCookieServer] = useState("");

  const handleReport = useCallback(() => {
    toast("제보 해주셔서 감사합니다!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    contentChange(0);
    setIsUpdate(true);
  });

  const handleReportFailed = useCallback(() => {
    toast("제보 시간이 아닙니다", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    contentChange(0);
    setIsUpdate(true);
  });

  // console.log(modal);

  const server_list = [
    {
      label: "루페온",
      value: "Lufeon",
    },
    {
      label: "실리안",
      value: "Silian",
    },
    {
      label: "아만",
      value: "Aman",
    },
    {
      label: "카마인",
      value: "Karmain",
    },
    {
      label: "카제로스",
      value: "Kazeros",
    },
    {
      label: "아브렐슈드",
      value: "Abrelshud",
    },
    {
      label: "카단",
      value: "Kardan",
    },
    {
      label: "니나브",
      value: "Ninave",
    },
  ];

  useEffect(() => {
    API.get("/periodicevents").then((res) => {
      let date = new Date();
      let getClosestEvent = getClosestData(res.data, date);
      setIsEventTime(getClosestEvent.event_status);
    });
  }, []);

  const menu = [
    {
      tab: "제보 내용",
      key: 0,
      content: (
        <MainTabContent
          server={server}
          data={data}
          update={isUpdate}
          modalControl={modalControl}
        />
      ),
    },
    {
      tab: "제보 하기",
      key: 1,
      content: (
        <ReportTabContent
          handleReport={handleReport}
          failed={handleReportFailed}
          server={server}
          isEventTime={isEventTime}
          auth={auth}
        />
      ),
    },
  ];

  const { contentItem, contentChange } = useTabs(0, menu);
  return (
    <>
      {!server ? (
        <PerfectScrollbar id="scrollbar-container-server-select">
          <>
            {!auth ? (
              <a href="/login">
                <div className="login_wrap">
                  <div className="login_text">Lostar 로그인</div>
                  <div className="login_tip">
                    로그인시 모든 기능을 이용할 수 있습니다!
                  </div>
                </div>
              </a>
            ) : (
              <></>
            )}
            <div className="mapLayer_content ac">
              {!auth ? (
                <div className="info_text">또는 비회원으로 이용하기</div>
              ) : (
                <></>
              )}
              <div className="content_subtitle">서버</div>
              <div className="server_select_wrap">
                {server_list.map((server) => {
                  return (
                    <a href={`/server/${server.value}`} key={server.label}>
                      <div className="server_list_item">
                        <div className="server_list_item_name">
                          <p className="server_name">{server.label}</p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>

              <div className="info_text">
                오류나 건의사항은{" "}
                <a
                  href="https://open.kakao.com/o/sqWmbsSd"
                  target="_blank"
                  style={{
                    color: "#f1de08",
                  }}
                >
                  오픈톡방
                </a>{" "}
                을 이용해주세요!
              </div>
            </div>
          </>
        </PerfectScrollbar>
      ) : (
        <>
          <div className="mapLayerControl_top_wrap">
            <div className="mapLayerControl_top_menu">
              {menu.map((item, index) => (
                <div
                  className={`${contentItem.key == index ? "active" : ""}`}
                  onClick={() => contentChange(index)}
                  key={index}
                >
                  {item.tab}
                </div>
              ))}
            </div>
          </div>
          {contentItem.content}
        </>
      )}
    </>
  );
}

export default MainContent;
