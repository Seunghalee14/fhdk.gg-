import { BsFillClockFill } from "react-icons/bs";
import API from "api";
import moment from "moment";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import InfiniteScroll from "react-infinite-scroll-component";
export default function NoticeContent({ data }) {
  const [notices, setNotices] = useState(data);
  const [hasMore, setHasMore] = useState(true);
  const getMoreNotice = async () => {
    const res = await API.get(
      `/notices?_limit=10&_start=${notices.length}&_sort=published:DESC`
    );
    if (res.data.length === 0) {
      setHasMore(false);
    }
    setNotices((notices) => [...notices, ...res.data]);
  };
  return (
    <>
      <div className="mapLayerControl_top_wrap">
        <div className="mapLayerControl_notice_title">
          <div>공지 사항</div>
        </div>
      </div>
      <div className="mapLayer_content">
        <PerfectScrollbar id="scrollbar-container">
          <div className="report_list_wrapper">
            <div className="report_list report_list_noti">
              {notices.length > 0 && (
                <InfiniteScroll
                  key="notice"
                  dataLength={notices.length}
                  next={getMoreNotice}
                  hasMore={hasMore}
                  loader={<h3 className="loading_text"> 로드중...</h3>}
                  scrollableTarget="scrollbar-container"
                  endMessage={
                    <div className="no_more_text">
                      <h4 className="loading_text">더이상 데이터가 없습니다</h4>
                    </div>
                  }
                >
                  {notices.map((notice, index) => (
                    <a href={notice.link} target="_blank" key={notice.slug}>
                      <div
                        className="report_list_item report_set"
                        // style={{ marginBottom: "15px", borderRadius: "4px" }}
                      >
                        <p className="report_title">{notice.title}</p>
                        <p className="report_date">
                          <BsFillClockFill />
                          {moment(notice.published).format("YYYY-MM-DD")}
                        </p>
                      </div>
                    </a>
                  ))}
                </InfiniteScroll>
              )}
            </div>
          </div>
        </PerfectScrollbar>
      </div>
    </>
  );
}
