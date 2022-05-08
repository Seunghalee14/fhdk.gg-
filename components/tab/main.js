import API from "api";
import moment from "moment";
import { useState, useEffect, useCallback } from "react";
import { BsFillClockFill } from "react-icons/bs";
import InfiniteScroll from "react-infinite-scroll-component";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useAppSelector, useAppDispatch } from "store";
import "react-perfect-scrollbar/dist/css/styles.css";
import { socket } from "script/socket";
import { colorChanger } from "script/script";
import { setContinent, setTerritory } from "features/loa/loaSlice";
import { Box, Button } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import AppContext from "context/AppContext";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import { isThisHour } from "date-fns";

import AdBanner from "@components/ad/adsense";
export default function MainTabContent(props) {
  const token = Cookie.get("token"); // 나중에 통합
  const { server, data, update, modalControl } = props;
  let server_name;
  switch (server) {
    case "Lufeon":
      server_name = "루페온";
      break;
    case "Silian":
      server_name = "실리안";
      break;
    case "Aman":
      server_name = "아만";
      break;
    case "Karmain":
      server_name = "카마인";
      break;
    case "Kazeros":
      server_name = "카제로스";
      break;
    case "Abrelshud":
      server_name = "아브렐슈드";
      break;
    case "Kardan":
      server_name = "카단";
      break;
    case "Ninave":
      server_name = "니나브";
      break;
  }

  const [reports, setReports] = useState(data);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useAppDispatch();
  // const getTerritory = useAppSelector(getTerritory);

  useEffect(() => {
    socket.on("new_report", (resp, error) => {
      if (resp.id !== null) {
        setReports((prev) => [resp, ...prev]);
      }
    });
  }, []);

  let encode = encodeURI(server_name);

  useEffect(() => {
    API.get(
      `/reports?_sort=published_at:DESC&_limit=10&_start=0&_where[0][server.name]=${encode}`,
      token && {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => {
      setReports(res.data);
    });
  }, [update]);

  const getMoreReport = async () => {
    const res = await API.get(
      `/reports?_sort=published_at:DESC&_limit=10&_start=${reports.length}&_where[0][server.name]=${encode}`,
      token && {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.length === 0) {
      setHasMore(false);
    }
    setReports((reports) => [...reports, ...res.data]);
  };
  const voteHandler = async (report, vote, date) => {
    if (isCurrentReportPeriod(date)) {
      await API.post(
        `/votes`,
        {
          report_id: report.uid,
          vote,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          let newData = reports.map((re) => {
            if (re.id === res.data.id) {
              re = res.data;
            }
            return re;
          });
          console.log(newData);
          setReports(newData);
        })
        .catch((err) => {
          toast("회원가입 후 이용 가능합니다", {
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
      toast("지난 제보는 추천/비추천이 불가능합니다", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const isCurrentReportPeriod = useCallback(
    (date) => isThisHour(new Date(date)),
    []
  );

  return (
    <>
      <div className="mapLayer_content">
        <div className="message">{server_name} 서버 제보 내용</div>
        <PerfectScrollbar id="scrollbar-container-one">
          <div className="report_list_wrapper">
            <div className="report_list">
              {/* <div className="adWrap">
                <AdBanner auto={false} width="100%" height="85px" />
              </div> */}
              {reports.length > 0 ? (
                <InfiniteScroll
                  key="main"
                  dataLength={reports.length}
                  next={getMoreReport}
                  hasMore={hasMore}
                  loader={<h3 className="loading_text"> 로드중...</h3>}
                  scrollableTarget="scrollbar-container-one"
                  endMessage={
                    <div className="no_more_text">
                      <h4 className="loading_text">더이상 데이터가 없습니다</h4>
                    </div>
                  }
                >
                  {reports.map((report, index) => (
                    <div
                      key={`${report.id}`}
                      className={`report_item_box ${
                        isCurrentReportPeriod(report.published_at)
                          ? "act_report"
                          : ""
                      }`}
                    >
                      <div>
                        <div
                          className="report_list_item"
                          key={index}
                          onClick={() => {
                            dispatch(setTerritory(report.territory));
                            dispatch(setContinent(report.continent));
                            modalControl();
                          }}
                        >
                          <p className="report_title">
                            {report.continent.name} / {report.territory.name} /
                            <span
                              style={{
                                color: colorChanger(report.itemcard.class),
                              }}
                            >
                              {" "}
                              {report.itemcard.name}
                            </span>{" "}
                            /
                            <span
                              style={{
                                color: colorChanger(report.itemfavor.class),
                              }}
                            >
                              {" "}
                              {report.itemfavor.name}
                            </span>
                          </p>
                          <p className="report_date">
                            <BsFillClockFill />{" "}
                            {moment(report.published_at).format(
                              "MM 월 DD 일 HH 시 mm 분"
                            )}
                          </p>
                          {report.downvote >= 1 && (
                            <div className="caution_message">
                              다수의 비추천을 받은 게시글입니다.
                            </div>
                          )}
                        </div>
                        <div className="voteWrap">
                          <Box sx={{ display: "flex" }}>
                            <Box sx={{ textAlign: "center", flexGrow: 1 }}>
                              <Button
                                fullWidth
                                startIcon={<ThumbUpIcon />}
                                sx={{
                                  color: "#fff",
                                  borderColor: "#eee",
                                  backgroundColor:
                                    report.vote === true
                                      ? "#1c5ce6"
                                      : "transparent",
                                  ":hover": {
                                    bgcolor: "#3e3d3d",
                                    color: "white",
                                  },
                                }}
                                onClick={() =>
                                  voteHandler(report, "up", report.published_at)
                                }
                              >
                                추천 {report.upvote === 0 ? "" : report.upvote}
                              </Button>
                            </Box>
                            <Box sx={{ textAlign: "center", flexGrow: 1 }}>
                              <Button
                                fullWidth
                                startIcon={<ThumbDownAltIcon />}
                                sx={{
                                  color: "#fff",
                                  borderColor: "#eee",
                                  backgroundColor:
                                    report.vote === false
                                      ? "#743535"
                                      : "transparent",
                                  ":hover": {
                                    bgcolor: "#3e3d3d",
                                    color: "white",
                                  },
                                }}
                                onClick={() =>
                                  voteHandler(
                                    report,
                                    "down",
                                    report.published_at
                                  )
                                }
                              >
                                비추천{" "}
                                {report.downvote === 0 ? "" : report.downvote}
                              </Button>
                            </Box>
                          </Box>
                        </div>
                      </div>
                      {/* {report.downvote >= 1 && (
                        <div className="report_block">
                          <div>
                            다수의 비추천으로 블라인드 처리된 제보입니다
                          </div>
                        </div>
                      )} */}
                    </div>
                  ))}
                </InfiniteScroll>
              ) : (
                <div className="no_more_text">
                  <h4 className="loading_text">
                    아직 서버에 제보내용이 없습니다!
                  </h4>
                </div>
              )}
            </div>
            +
          </div>
        </PerfectScrollbar>
      </div>
    </>
  );
}
