import API from "api";
import dynamic from "next/dynamic";
import Cookies from "cookies";
import MapLayer from "@components/map_layer";
import { socket } from "../script/socket";
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
function IndexPage({ notice, menu }) {
  const { user, setUser } = useContext(AppContext);
  const [origin, setOrigin] = useState(null);

  const reports = useAppSelector(getTerritory);
  const [mapHelperVisible, setMapHelperVisible] = useState(false);

  useEffect(() => {
    socket.emit("join", { server }, (error) => {
      console.log(error);
    });
  }, []);  
  const server = null;  
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

IndexPage.getInitialProps = async (ctx) => {
  const { req, query, res } = ctx;
  let menu = query.menu;
  if (menu == null || menu == undefined) {
    menu = "main";
  }
  const notice = await API.get(
    `/notices?_limit=10&_start=0&_sort=published:DESC`
  );

  return { notice: notice.data, menu: menu };
};

export default IndexPage;
