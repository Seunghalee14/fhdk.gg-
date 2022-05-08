import API from "api";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useAppSelector, useAppDispatch } from "store";
import "react-perfect-scrollbar/dist/css/styles.css";
import {
  getContinent,
  getContinents,
  getMenuContinent,
  getMenuTerritory,
  getTerritory,
  setContinent,
  setContinents,
  setMenuContinent,
  setMenuTerritory,
  setTerritory,
} from "features/loa/loaSlice";

export default function PopupPanelContinent({ modalSnapControl }) {
  // const [continentData, setContinentData] = useState(null);
  // const [territoriesData, setTerritoriesData] = useState(null);

  const dispatch = useAppDispatch();
  const continentData = useAppSelector(getContinents);
  const continent = useAppSelector(getContinent);
  const menuContinent = useAppSelector(getMenuContinent);
  const menuTerritory = useAppSelector(getMenuTerritory);
  const territoriesData = useAppSelector(getTerritory);

  useEffect(() => {
    API.get("/continents").then((res) => {
      console.log(territoriesData);
      dispatch(setContinents(res.data));
    });
  }, []);

  function handleContinent(id) {
    let territories = continentData.find((continent) => continent.id === id);
    dispatch(setMenuTerritory(territories.territories));
  }

  function handleTerritoryReset() {
    dispatch(setMenuTerritory(null));
  }

  return (
    <>
      <div className="mapLayerControl_top_wrap">
        <div className="message"> 클릭하면 해당 지도로 이동 됩니다. </div>
      </div>
      <PerfectScrollbar className="mapLayer_content">
        {!menuTerritory ? (
          <>
            {continentData &&
              continentData.map((continent, index) => (
                <div
                  className="report_list_item"
                  style={{ marginBottom: "10px", borderRadius: "4px" }}
                  key={index}
                  onClick={() => {
                    handleContinent(continent.id);
                    // dispatch(setMenuContinent(continent));
                    dispatch(setContinent(continent));
                  }}
                >
                  <p className="report_title lis">{continent.name}</p>
                </div>
              ))}
          </>
        ) : (
          <>
            {menuTerritory && (
              <>
                <div className="quick_title">{continent.name}</div>
                <div
                  className="report_list_item back"
                  style={{ marginBottom: "10px", borderRadius: "4px" }}
                  key="back"
                  onClick={() => {
                    handleTerritoryReset();
                  }}
                >
                  <p className="report_title lis">돌아가기</p>
                </div>
                {menuTerritory.map((territory, index) => (
                  <div
                    className="report_list_item"
                    style={{ marginBottom: "10px", borderRadius: "4px" }}
                    key={index}
                    onClick={() => {
                      dispatch(setTerritory(territory));
                      modalSnapControl();
                    }}
                  >
                    <p className="report_title lis">{territory.name}</p>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </PerfectScrollbar>

      {/* <div className="popupLayerWrap">
        <div className="title">
          빠른 이동
          <div
            className="close_btn"
            onClick={() => {
              handleClose();
              setTerritoriesData(null);
            }}
          >
            <AiFillCloseCircle />
          </div>
        </div>
        <div className="popupContentWrap">

        </div>
      </div> */}
    </>
  );
}
