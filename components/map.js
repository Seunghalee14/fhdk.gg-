import Link from "next/link";
import moment from "moment";
import { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import { useAppSelector, useAppDispatch } from "store";
import TextIcon from "./map/textMarker";
import API from "api";
import "leaflet/dist/leaflet.css";
import PopupPanel from "./map/popupPanel";
import ReportMarker from "./map/reportMarker";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { AiFillInfoCircle } from "react-icons/ai";
import { useWindowSize } from "script/hook";
import { socket } from "script/socket";
import {
  getMap,
  getMapUrl,
  getTerritory,
  setMapUrl,
  setTerritory,
  setZoom,
  getContinent,
  setContinent,
  selectIsPanelOpenPC,
  setIsPanelOpenPC,
  setMenuContinent,
  getMenuContinent,
  setMenuTerritory,
  setIsPanelOpen,
  setComponentType,
} from "features/loa/loaSlice";
import { getClosestData } from "lib/parse";
import { Tooltip } from "@mui/material";
// const center = [0, 0];
const center = [-0.3932, -12.1165];
function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function MapView({ server, reports }) {
  const [map, setMap] = useState();
  const [mapCenter, setMapCenter] = useState(center);
  const [lostarkData, setLostarkData] = useState({});
  const [lostarkReportData, setLostarkReportData] = useState([]);
  const size = useWindowSize();
  const [randomString, setRandomString] = useState(makeid(10));
  const [mapTerritoryVisible, setMapTerritoryVisible] = useState(false);

  const dispatch = useAppDispatch();
  const mapInfo = useAppSelector(getMap);
  const mapUrl = useAppSelector(getMapUrl);
  const menuContinent = useAppSelector(getMenuContinent);
  const continent = useAppSelector(getContinent);
  const territory = useAppSelector(getTerritory);
  const isPopupOpend = useAppSelector(selectIsPanelOpenPC);

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

  const getNextData = (origin_data, next_data, color) => {
    let new_data = [];
    origin_data.forEach((data) => {
      let next_value = false;
      let origin_color = "#fff";
      next_data.forEach((next_data) => {
        if (data.id === next_data.id) {
          next_value = true;
          origin_color = color;
        }
      });
      new_data.push({ ...data, next_value, origin_color });
    });
    return new_data;
  };

  useEffect(() => {
    dispatch(setMapUrl("/map/{z}/tile_{x}_{y}.png"));
    API.get("/continents").then((res) => {
      var origin_data = res.data;
      let dup_data = [];
      origin_data.forEach((data) => {
        if (data.name === "루테란 동부") {
          dup_data.push(...data.territories);
        }
      });
      origin_data = origin_data.map((e) => {
        if (e.name === "루테란 동부") {
          e.territories = dup_data;
        }
        return e;
      });
      setLostarkData(origin_data);
      API.get("/periodicevents").then((res) => {
        let date = new Date();
        let getClosestEvent = getClosestData(res.data, date);
        if (getClosestEvent.event_status) {
          let getMissingData = getClosestEvent.current_data.continents.find(
            (e) => {
              if (e.name === "루테란 동부") {
                return e;
              }
            }
          );
          if (getMissingData) {
            if (getMissingData.id === 4) {
              getClosestEvent.current_data.continents.push({
                created_at: "2021-11-10T02:12:28.421Z",
                id: 5,
                location: [-62.7013, 56.2679],
                location_event: [-55.1491, 50.6915],
                name: "루테란 동부",
                published_at: "2021-11-10T02:12:29.947Z",
                updated_at: "2021-11-14T12:45:28.895Z",
              });
            } else {
              getClosestEvent.current_data.continents.push({
                created_at: "2021-11-10T02:12:20.549Z",
                id: 5,
                location: [-62.7013, 56.2679],
                location_event: [-55.1491, 50.6915],
                name: "루테란 동부",
                published_at: "2021-11-10T02:12:22.102Z",
                updated_at: "2021-11-14T12:45:25.680Z",
              });
            }
          }
        } else {
          let getMissingData = getClosestEvent.next_data.continents.find(
            (e) => {
              if (e.name === "루테란 동부") {
                return e;
              }
            }
          );
          if (getMissingData) {
            if (getMissingData.id === 4) {
              getClosestEvent.next_data.continents.push({
                created_at: "2021-11-10T02:12:28.421Z",
                id: 5,
                location: [-62.7013, 56.2679],
                location_event: [-55.1491, 50.6915],
                name: "루테란 동부",
                published_at: "2021-11-10T02:12:29.947Z",
                updated_at: "2021-11-14T12:45:28.895Z",
              });
            } else {
              getClosestEvent.next_data.continents.push({
                created_at: "2021-11-10T02:12:20.549Z",
                id: 5,
                location: [-62.7013, 56.2679],
                location_event: [-55.1491, 50.6915],
                name: "루테란 동부",
                published_at: "2021-11-10T02:12:22.102Z",
                updated_at: "2021-11-14T12:45:25.680Z",
              });
            }
          }
        }
        if (!getClosestEvent.event_status) {
          let next_data = getClosestEvent.next_data.continents;
          let next_find = getNextData(origin_data, next_data, "#efafff");
          setLostarkData(next_find);
        } else {
          let currentDate = moment().format("HH");
          let date = moment().format("YYYY-MM-DD");
          let start = `${currentDate}:30:00`;
          let end = `${currentDate}:56:00`;
          let current_data = getClosestEvent.current_data.continents;
          let current_find = getNextData(origin_data, current_data, "#ffeb55");
          setLostarkData(current_find);
          API.get(
            `/reports?_sort=published_at:DESC&_where[0][report_date_gte]=${start}&_where[1][report_date_lt]=${end}&_where[2][created_at_gte]=${date}&_where[3][server.name]=${encodeURI(
              server_name
            )}`
          ).then((res) => {
            let data = res.data;
            setLostarkReportData(data);
          });
        }
      });
    });
  }, []);

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27 && continent === null) {
      handleOriginmap();
      handleOriginmap();
      dispatch(setTerritory(null));
    }
  });

  const mouseEvent = useCallback((event) => {
    event.preventDefault();
    if (event.type === "contextmenu") {
      handleOriginmap();
      handleOriginmap();
      dispatch(setTerritory(null));
    }
  });

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  useEffect(() => {
    socket.on("new_report", (resp, error) => {
      if (resp.id !== null) {
        // setLostarkReportData([resp, ...lostarkReportData]);
        setLostarkReportData((prev) => [resp, ...prev]);
      }
    });
    // return () => {
    //   socket.close();
    // };
  }, []);

  function handlerPin(continent) {
    dispatch(setMenuContinent(continent));
  }
  useEffect(() => {
    if (reports && map) {
      if (size.width < 768) {
        const offset = map.getSize().x * -0.0049;
        const offsety = map.getSize().y * -0.0099;
        setMapCenter([offset, offsety]);
        dispatch(setMapUrl(reports.iamge));
        setMapTerritoryVisible(true);
        dispatch(
          setZoom({
            default: 1,
            minZoom: 1,
            maxZoom: 2,
          })
        );
        setRandomString(makeid(10));
      } else {
        const offset = map.getSize().x * -0.0049;
        const offsety = map.getSize().y * -0.0099;
        setMapCenter([offset, offsety]);
        dispatch(setMapUrl(reports.iamge));
        setMapTerritoryVisible(true);
        dispatch(
          setZoom({
            default: 2,
            minZoom: 1,
            maxZoom: 2,
          })
        );
        setRandomString(makeid(15));
      }
    }
  }, [reports]);

  const handleTerritory = useCallback((data) => {
    if (map) {
      if (size.width < 768) {
        const offset = map.getSize().x * -0.0049;
        const offsety = map.getSize().y * -0.0099;
        setMapCenter([offset, offsety]);
        setRandomString(makeid(15));
        dispatch(setMapUrl(data.image));
        setMapTerritoryVisible(true);
        dispatch(
          setZoom({
            default: 0,
            minZoom: 3,
            maxZoom: 3,
          })
        );
      } else {
        const offset = map.getSize().x * -0.0049;
        const offsety = map.getSize().y * -0.0099;
        setMapCenter([offset, offsety]);
        setRandomString(makeid(15));
        dispatch(setMapUrl(data.image));
        setMapTerritoryVisible(true);

        dispatch(
          setZoom({
            default: 0,
            minZoom: 3,
            maxZoom: 3,
          })
        );
      }
    }
  });

  const handleOriginmap = useCallback(() => {
    setRandomString(makeid(15));
    setMapCenter(center);
    dispatch(setMapUrl("/map/{z}/tile_{x}_{y}.png"));
    dispatch(setMenuTerritory(null));
    setMapTerritoryVisible(false);
    dispatch(
      setZoom({
        default: 3,
        minZoom: 2,
        maxZoom: 5,
      })
    );
  });
  return (
    <>
      {mapTerritoryVisible && (
        <>
          <Tooltip title="현재 위치 정보" placement="bottom">
            <div className="map_overlay">
              <div className="map_overlay_inner">
                <AiFillInfoCircle />
                <div>
                  {continent && continent.name} / {territory.name}
                </div>
              </div>
            </div>
          </Tooltip>
          <div className="maps_button_wrap">
            <div
              className="maps_on_off btn"
              onClick={() => {
                handleOriginmap();
              }}
            >
              <BsArrowLeftCircleFill />
              <div>돌아가기</div>
            </div>
          </div>
        </>
      )}

      <div
        onContextMenu={(e) => {
          mapTerritoryVisible && mouseEvent(e);
        }}
      >
        <MapContainer
          className="loa-map"
          center={mapCenter}
          zoom={mapInfo.zoom.default}
          minZoom={mapInfo.zoom.minZoom}
          maxZoom={mapInfo.zoom.maxZoom}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{
            height: "100vh",
            width: "100%",
            boxSizing: "border-box",
            backgroundColor: "rgb(0, 0, 0)",
          }}
          whenCreated={setMap}
          key={randomString}
          onKeyDown={(e) => {
            mapTerritoryVisible && escFunction(e);
          }}
        >
          <TileLayer noWrap={true} url={mapUrl} key={mapUrl} />
          {!mapTerritoryVisible &&
            lostarkData.length > 0 &&
            lostarkData.map((continent) => (
              <Marker
                key={continent.id}
                position={continent.location}
                icon={TextIcon(
                  continent.name,
                  continent.next_value,
                  30,
                  continent.origin_color
                )}
                eventHandlers={{
                  click: (e) => {
                    if (size.width > 768) {
                      dispatch(setIsPanelOpenPC(true));
                      dispatch(setContinent(continent));
                      handlerPin(continent);
                    } else {
                      // mobile
                      dispatch(setIsPanelOpen(true));
                      dispatch(setComponentType("quick"));
                      dispatch(setContinent(continent));
                      dispatch(setMenuTerritory(continent.territories));
                    }
                  },
                }}
              ></Marker>
            ))}
          {!mapTerritoryVisible &&
            lostarkReportData.length > 0 &&
            lostarkReportData.map((data) => (
              <Marker
                key={data.id}
                position={data.continent.location_event}
                icon={ReportMarker(data, 10)}
                eventHandlers={{
                  click: (e) => {
                    dispatch(setIsPanelOpenPC(true));
                    dispatch(setContinent(data.continent));
                    dispatch(setTerritory(data.territory));
                  },
                }}
              ></Marker>
            ))}
          <ZoomControl position="bottomright" />
        </MapContainer>
      </div>

      {isPopupOpend && <PopupPanel handleTerritory={handleTerritory} />}
    </>
  );
}

export default MapView;
