import {
  getContinent,
  getMenuContinent,
  setIsPanelOpen,
  setIsPanelOpenPC,
  setTerritory,
} from "features/loa/loaSlice";
import { AiFillCloseCircle } from "react-icons/ai";
import { useAppSelector } from "store";
import { useAppDispatch } from "store";
export default function PopupPanel({}) {
  // const [continentData, setContinentData] = useState(null);
  const dispatch = useAppDispatch();
  const continentData = useAppSelector(getMenuContinent);

  function closePanel() {
    // setContinentData(continent);
    dispatch(setIsPanelOpenPC(false));
  }

  return (
    <>
      {continentData && (
        <div className="popupLayerWrap">
          <div className="title">
            {continentData.name}
            <div
              className="close_btn"
              onClick={() => {
                closePanel();
              }}
            >
              <AiFillCloseCircle />
            </div>
          </div>
          <div className="popupContentWrap">
            <div className="message"> 클릭하면 해당 지도로 이동 됩니다. </div>
            <div className="popupContent">
              {continentData.territories.map((territory, index) => (
                <div
                  className="report_list_item"
                  style={{ marginBottom: "10px", borderRadius: "4px" }}
                  key={index}
                  onClick={() => {
                    dispatch(setTerritory(territory));
                    // handleTerritory(territory);
                  }}
                >
                  <p className="report_title lis">{territory.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
