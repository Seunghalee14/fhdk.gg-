import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";

// export interface LoaState {
//     isPanelOpen: boolean;
// }

const initialState = {
  map: {
    url: "map/{z}/tile_{x}_{y}.png",
    zoom: {
      default: 3,
      minZoom: 2,
      maxZoom: 5,
    },
  },
  menuTerritory: null,
  menuContinent: null,
  continents: null,
  continent: null,
  territory: null,
  isPanelOpen: false,
  isPanelOpenPC: false,
  componentType: null,
};

const loaSlice = createSlice({
  name: "loa",
  initialState,
  reducers: {
    setMapUrl: (state, action) => {
      state.map.url = action.payload;
    },
    setZoom: (state, action) => {
      state.map.zoom = action.payload;
    },
    setMenuContinent: (state, action) => {
      state.menuContinent = action.payload;
    },
    setContinents: (state, action) => {
      state.continents = action.payload;
    },
    setContinent: (state, action) => {
      state.continent = action.payload;
    },
    setMenuTerritory: (state, action) => {
      state.menuTerritory = action.payload;
    },
    setTerritory: (state, action) => {
      state.territory = action.payload;
    },
    setIsPanelOpenPC: (state, action) => {
      const isPanelOpenPC = action.payload;
      state.isPanelOpenPC = isPanelOpenPC;
    },
    setIsPanelOpen: (state, action) => {
      const isPanelOpen = action.payload;
      state.isPanelOpen = isPanelOpen;
    },
    setComponentType: (state, action) => {
      const componentType = action.payload;
      state.componentType = componentType;
    },
  },
});
export const {
  setMapUrl,
  setZoom,
  setMinZoom,
  setMaxZoom,
  setMenuTerritory,
  setTerritory,
  setMenuContinent,
  setContinent,
  setContinents,
  setIsPanelOpen,
  setIsPanelOpenPC,
  setComponentType,
} = loaSlice.actions;

const loaReducer = loaSlice.reducer;

const loaSelector = (state) => state.loa;

export const getMap = createSelector(loaSelector, (loa) => loa.map);
export const getMapUrl = createSelector(loaSelector, (loa) => loa.map.url);
export const getMenuTerritory = createSelector(
  loaSelector,
  (loa) => loa.menuTerritory
);
export const getTerritory = createSelector(loaSelector, (loa) => loa.territory);
export const getMenuContinent = createSelector(
  loaSelector,
  (loa) => loa.menuContinent
);
export const getContinent = createSelector(loaSelector, (loa) => loa.continent);
export const getContinents = createSelector(
  loaSelector,
  (loa) => loa.continents
);
export const selectIsPanelOpenPC = createSelector(
  loaSelector,
  (r) => r.isPanelOpenPC
);
export const selectIsPanelOpen = createSelector(
  loaSelector,
  (r) => r.isPanelOpen
);
export const getComponentType = createSelector(
  loaSelector,
  (r) => r.componentType
);

export default loaReducer;
