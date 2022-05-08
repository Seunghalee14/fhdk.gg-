import API from "api";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import Select from "react-select";
const server_option = [
  { value: "1", label: "루페온" },
  { value: "2", label: "실리안" },
  { value: "3", label: "아만" },
  { value: "4", label: "카마인" },
  { value: "5", label: "카제로스" },
  { value: "6", label: "아브렐슈드" },
  { value: "7", label: "카단" },
  { value: "8", label: "니나브" },
];
const continent_option = [
  { value: "1", label: "아르테미스" },
  { value: "2", label: "유디아" },
  { value: "3", label: "루테란 서부" },
  { value: "4", label: "루테란 동부 (모리스)" },
  { value: "5", label: "루테란 동부 (버트)" },
  { value: "6", label: "토토이크" },
  { value: "7", label: "애니츠" },
  { value: "8", label: "아르데타인" },
  { value: "9", label: "베른 북부" },
  { value: "10", label: "슈샤이어" },
  { value: "11", label: "로헨델" },
  { value: "12", label: "욘" },
  { value: "13", label: "페이튼" },
  { value: "14", label: "파푸니카" },
  { value: "15", label: "베른 남부" },
];
const territory_option = [
  { value: "1", label: "로그힐" },
  { value: "2", label: "안게모스 산 기슭" },
  { value: "3", label: "국경지대" },
  { value: "4", label: "오즈혼 구릉지" },
  { value: "5", label: "실란드 구릉지" },
  { value: "6", label: "자고라스 산" },
  { value: "7", label: "레이크바" },
  { value: "8", label: "메드리닉 수도원" },
  { value: "9", label: "빌브린숲" },
  { value: "10", label: "격전의 평야" },
  { value: "11", label: "디오리카 평원" },
  { value: "12", label: "해무리 언덕" },
  { value: "13", label: "배꽃나무 자생지" },
  { value: "14", label: "흑장미 교회당" },
  { value: "15", label: "라이아 단구" },
  { value: "16", label: "보레아 영지" },
  { value: "17", label: "크로커니스 해변" },
  { value: "18", label: "바다향기 숲" },
  { value: "19", label: "달콤한 숲" },
  { value: "20", label: "성큼바위 숲" },
  { value: "21", label: "침묵하는 거인의 숲" },
  { value: "22", label: "델파이 현" },
  { value: "23", label: "등나무 언덕" },
  { value: "24", label: "소리의 숲" },
  { value: "25", label: "거울 계곡" },
  { value: "26", label: "황혼의 연무" },
  { value: "27", label: "메마른 통로" },
  { value: "28", label: "갈라진 땅" },
  { value: "29", label: "네벨호른" },
  { value: "30", label: "바람결 구릉지" },
  { value: "31", label: "토트리치" },
  { value: "32", label: "리제 폭포" },
  { value: "33", label: "크로나 항구" },
  { value: "34", label: "파르나 숲" },
  { value: "35", label: "페스나르 고원" },
  { value: "36", label: "베르닐 삼림" },
  { value: "37", label: "발란카르 산맥" },
  { value: "38", label: "얼어붙은 바다" },
  { value: "39", label: "칼날바람 언덕" },
  { value: "40", label: "서리감옥 고원" },
  { value: "41", label: "머무른 시간의 호수" },
  { value: "42", label: "얼음나비 절벽" },
  { value: "43", label: "은빛물결 호수" },
  { value: "44", label: "유리연꽃 호수" },
  { value: "45", label: "바람향기 언덕" },
  { value: "46", label: "파괴된 제나일" },
  { value: "47", label: "엘조윈의 그늘" },
  { value: "48", label: "시작의 땅" },
  { value: "49", label: "미완의 정원" },
  { value: "50", label: "검은모루 작업장" },
  { value: "51", label: "무쇠망치 작업장" },
  { value: "52", label: "기약의 땅" },
  { value: "53", label: "칼라자 마을" },
  { value: "54", label: "얕은 바닷길" },
  { value: "55", label: "별모래 해변" },
  { value: "56", label: "티키티카 군락지" },
  { value: "57", label: "비밀의 숲" },
  { value: "58", label: "칸다리아 영지" },
  { value: "59", label: "벨리온 유적지" },
];
const favor_option = [
  {
    value: 1,
    label: "두근두근 상자",
  },
  {
    value: 2,
    label: "더욱 화려한 꽃다발",
  },
  {
    value: 3,
    label: "레온하트 감자",
  },
  {
    value: 4,
    label: "아르테미스 성수",
  },
  {
    value: 5,
    label: "하늘을 비추는 기름",
  },
  {
    value: 6,
    label: "유디아 천연소금",
  },
  {
    value: 7,
    label: "유디아 주술서",
  },
  {
    value: 8,
    label: "사슬전쟁 실록",
  },
  {
    value: 9,
    label: "흑장미",
  },
  {
    value: 10,
    label: "견고한 새장",
  },
  {
    value: 11,
    label: "레이크바 토마토 주스",
  },
  {
    value: 12,
    label: "디오리카 밀짚모자",
  },
  {
    value: 13,
    label: "루테란 검 모형",
  },
  {
    value: 14,
    label: "아제나포리움 브리치",
  },
  {
    value: 15,
    label: "수줍은 바람꽃가루",
  },
  {
    value: 16,
    label: "동글동글한 유리조각",
  },
  {
    value: 17,
    label: "모코코 당근",
  },
  {
    value: 18,
    label: "특대 무당벌레 인형",
  },
  {
    value: 19,
    label: "강태공의 낚싯대",
  },
  {
    value: 20,
    label: "비무제 참가 인장",
  },
  {
    value: 21,
    label: "고급 측음기",
  },
  {
    value: 22,
    label: "에너지 X7 캡슐",
  },
  {
    value: 23,
    label: "베른 건국 기념주화",
  },
  {
    value: 24,
    label: "기사단 가입 신청서",
  },
  {
    value: 25,
    label: "고블린 고구마",
  },
  {
    value: 26,
    label: "마법 옷감",
  },
  {
    value: 27,
    label: "마력 결정",
  },
  {
    value: 28,
    label: "화려한 오르골",
  },
  {
    value: 29,
    label: "시리우스의 성서",
  },
  {
    value: 30,
    label: "빛나는 정수",
  },
  {
    value: 31,
    label: "실린여왕의 축복",
  },
  {
    value: 32,
    label: "새벽의 마력석",
  },
  {
    value: 33,
    label: "정령의 깃털",
  },
  {
    value: 34,
    label: "다뉴브의 목걸이",
  },
  {
    value: 35,
    label: "파후투르 맥주",
  },
  {
    value: 36,
    label: "피에르의 비법서",
  },
  {
    value: 37,
    label: "붉은 달의 눈물",
  },
  {
    value: 38,
    label: "부러진 단검",
  },
  {
    value: 39,
  },
  {
    value: 40,
    label: "바짝 마른 동상",
  },
  {
    value: 41,
    label: "오레하의 수석",
  },
  {
    value: 42,
    label: "포튼쿨 열매",
  },
  {
    value: 43,
    label: "피냐타 제작 세트",
  },
  {
    value: 44,
    label: "무지개 티키티카 꽃",
  },
  {
    value: 45,
    label: "사령술사의 기록",
  },
  {
    value: 46,
    label: "페브리 포션",
  },
  {
    value: 47,
    label: "깃털 부채",
  },
  {
    value: 48,
    label: "모형 반딧불이",
  },
];
const item_option = [
  {
    value: 1,
    label: "시이라",
  },
  {
    value: 2,
    label: "모리나",
  },
  {
    value: 3,
    label: "자이언트 웜",
  },
  {
    value: 4,
    label: "카도건",
  },
  {
    value: 5,
    label: "베르하트",
  },
  {
    value: 6,
    label: "모르페오",
  },
  {
    value: 7,
    label: "푸름전사 브리뉴",
  },
  {
    value: 8,
    label: "창조의 알",
  },
  {
    value: 9,
    label: "월향도사",
  },
  {
    value: 10,
    label: "수령도사",
  },
  {
    value: 11,
    label: "객주도사",
  },
  {
    value: 12,
    label: "아이히만 박사",
  },
  {
    value: 13,
    label: "슈테른 네리아",
  },
  {
    value: 14,
    label: "자베른",
  },
  {
    value: 15,
    label: "바투루",
  },
  {
    value: 16,
    label: "네온하트 네리아",
  },
  {
    value: 17,
    label: "천둥",
  },
  {
    value: 18,
    label: "하셀링크",
  },
  {
    value: 19,
    label: "미한",
  },
  {
    value: 20,
    label: "녹스",
  },
  {
    value: 21,
    label: "세리아",
  },
  {
    value: 22,
    label: "수호자 에오로",
  },
  {
    value: 23,
    label: "기드온",
  },
  {
    value: 24,
    label: "페일린",
  },
  {
    value: 25,
    label: "시안",
  },
  {
    value: 26,
    label: "엘레노아",
  },
  {
    value: 27,
    label: "알리페르",
  },
  {
    value: 28,
    label: "피에르",
  },
  {
    value: 29,
    label: "위대한 성 네리아",
  },
  {
    value: 30,
    label: "굴딩",
  },
  {
    value: 31,
    label: "비올레",
  },
  {
    value: 32,
    label: "스텔라",
  },
  {
    value: 33,
    label: "키케라",
  },
  {
    value: 34,
    label: "세토",
  },
  {
    value: 35,
    label: "기드온",
  },
  {
    value: 36,
    label: "페일린",
  },
  {
    value: 37,
    label: "천둥날개",
  },
  {
    value: 38,
    label: "모카모카",
  },
  {
    value: 39,
    label: "카인",
  },
  {
    value: 40,
    label: "라하르트",
  },
  {
    value: 41,
    label: "진 매드닉",
  },
  {
    value: 42,
    label: "그노시스",
  },
  {
    value: 43,
    label: "케이사르",
  },
  {
    value: 44,
    label: "칼도르",
  },
  {
    value: 45,
    label: "알비온",
  },
  {
    value: 46,
    label: "웨이",
  },
];

export default function ReportTabContentBackup(props) {
  const { handleReport } = props;
  const [serverSelect, setServerSelect] = useState(null);
  const [continentSelect, setContinentSelect] = useState(null);
  const [territorySelect, setTerritorySelect] = useState(null);
  const [favorSelect, setFavorSelect] = useState(null);
  const [itemSelect, setItemSelect] = useState(null);

  const serverRef = useRef(null);
  const continentRef = useRef(null);
  const territoryRef = useRef(null);
  const favorRef = useRef(null);
  const itemRef = useRef(null);

  function handleReportSubmit(e) {
    e.preventDefault();
    let server = serverSelect.value;
    let continent = continentSelect.value;
    let territory = territorySelect.value;

    API.post("/reports", {
      server: [server],
      continent: [continent],
      territory: [territory],
    }).then((res) => {
      serverRef.current.clearValue();
      continentRef.current.clearValue();
      territoryRef.current.clearValue();
      favorRef.current.clearValue();
      itemRef.current.clearValue();
      handleReport();
    });
  }

  return (
    <>
      <div className="content_subtitle">서버</div>
      <Select
        ref={serverRef}
        defaultValue={serverSelect}
        onChange={setServerSelect}
        options={server_option}
        placeholder="서버 선택"
        noOptionsMessage={() => "검색 결과 없음"}
      />
      <div className="content_subtitle">대륙</div>
      <Select
        ref={continentRef}
        defaultValue={continentSelect}
        onChange={setContinentSelect}
        options={continent_option}
        placeholder="대륙 선택"
        noOptionsMessage={() => "검색 결과 없음"}
      />
      <div className="content_subtitle">지역</div>
      <Select
        ref={territoryRef}
        defaultValue={territorySelect}
        onChange={setTerritorySelect}
        options={territory_option}
        placeholder="지역 선택"
        noOptionsMessage={() => "검색 결과 없음"}
      />

      <div className="content_subtitle">호감도 아이템 </div>
      <Select
        ref={favorRef}
        defaultValue={favorSelect}
        onChange={setFavorSelect}
        options={favor_option}
        placeholder="호감도 아이템 선택"
        noOptionsMessage={() => "검색 결과 없음"}
      />

      <div className="content_subtitle">카드 </div>
      <Select
        ref={itemRef}
        defaultValue={itemSelect}
        onChange={setItemSelect}
        options={item_option}
        placeholder="카드 선택"
        noOptionsMessage={() => "검색 결과 없음"}
      />

      {serverSelect && continentSelect && territorySelect ? (
        <div
          className="report_button"
          onClick={(e) => {
            handleReportSubmit(e);
          }}
        >
          제보 하기
        </div>
      ) : (
        <div className="report_button disable">제보 하기</div>
      )}
    </>
  );
}
