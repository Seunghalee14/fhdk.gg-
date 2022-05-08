import { useRef, useState, useEffect, useMemo, useCallback } from "react";
// import Select from "react-select";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import API from "api";
import "react-toastify/dist/ReactToastify.css";

function EventContent(props) {
  const { server } = props;
  const [rank, setRank] = useState([]);
  const getRank = async () => {
    const res = await API.post(`/ranks`, {
      server: server,
    });
    setRank(res.data);
  };
  const colorChange = (index) => {
    if (index === 0) {
      return "#0044a9";
    } else if (index === 1) {
      return "#28579d";
    } else if (index === 2) {
      return "#333";
    } else {
      return "#9e9e9e";
    }
  };

  useEffect(() => {
    getRank();
  }, []);
  return (
    <>
      {server && (
        <div className="mapLayer_content">
          <div className="message">
            매달 1위부터 3위까지 제보수 기반으로 추첨을 진행합니다
          </div>

          <PerfectScrollbar id="scrollbar-container-event">
            <div className="report_list_wrapper">
              <div className="report_list report_list_noti">
                {rank.length > 0 &&
                  rank.map((item, index) => (
                    <div className="rank_wrap">
                      {index + 1 < 4 && (
                        <div
                          className="rank_"
                          style={{ backgroundColor: colorChange(index) }}
                        >
                          <span>{index + 1} 등</span>
                        </div>
                      )}
                      <div className="rank_box">
                        <div className="title">{item.username}</div>
                        <div className="sub_">
                          <p className="sub_wrap">
                            <span className="strong">제보 수</span>
                            <span>
                              <LocalFireDepartmentIcon /> {item.count}
                            </span>
                          </p>
                          <p className="sub_wrap">
                            <span className="strong">추천 수</span>
                            <span>
                              <ThumbUpIcon /> {item.upvote}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                {rank.length === 0 && (
                  <div className="rank_wrap">
                    <div className="info_wrap">
                      <div className="info_text2">
                        현재 추첨을 위한 추천수 집계 중 입니다. <br />
                        매달 1일에 재 갱신 됩니다.
                      </div>
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
                )}
              </div>
            </div>
          </PerfectScrollbar>
        </div>
      )}

      {!server && (
        <div className="mapLayerControl_top_wrap">
          <div className="message">매달 1위부터 3위까지 추첨!</div>
          <div className="rank_wrap">
            <div className="info_wrap">
              <div className="info_text2">
                현재 서버 선택이 되어있지 않은 것 같습니다 <br />
                서버 선택 후 이용해주세요
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventContent;
