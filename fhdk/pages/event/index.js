import API from "api";
import dynamic from "next/dynamic";
import Cookies from "cookies";
import MapLayer from "@components/mapLayer/event";
import { socket } from "../../script/socket";
const MapView = dynamic(() => import("@components/map"), { ssr: false });
import {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { useCookies } from "react-cookie";
import { useAppSelector } from "store";
import { getTerritory } from "features/loa/loaSlice";
import AppContext from "context/AppContext";

function ServerReportPage({ server, data, notice, menu }) {
  const { user, setUser } = useContext(AppContext);
  const [origin, setOrigin] = useState(data);

  const reports = useAppSelector(getTerritory);
  const [mapHelperVisible, setMapHelperVisible] = useState(false);

  useEffect(() => {
    socket.emit("join", { server }, (error) => {
      console.log(error);
    });
  }, []);

  return (
    <>
      <MapLayer
        server={server}
        data={origin}
        notice={notice}
        auth={!!user}
        user={user}
        siteMenu={menu}
      />
      <MapView server={server} reports={reports} />
    </>
  );
}

ServerReportPage.getInitialProps = async (ctx) => {
  const { req, query, res } = ctx;
  let menu = query.menu;
  if (menu == null || menu == undefined) {
    menu = "main";
  }
  console.log("hi");

  let s = query.slug;
  let server_name;
  switch (s) {
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
  let encode = encodeURI(server_name);
  const result = await API.get(
    `/reports?_sort=published_at:DESC&_limit=10&_start=0&_where[0][server.name]=${encode}`
  );
  const notice = await API.get(
    `/notices?_limit=10&_start=0&_sort=published:DESC`
  );

  return { server: s, data: result.data, notice: notice.data, menu: menu };
};

export default ServerReportPage;
