// 1 일반 '#fff'
// 2 고급 '#a1b853'
// 3 희귀 "#4285f4"
// 4 영웅 '#9900ff'
// 5 전설 '#fcc83b'

export function colorChanger(color) {
  switch (color) {
    case 1:
      return "#fff";
    case 2:
      return "#a1b853";
    case 3:
      return "#4285f4";
    case 4:
      return "#9900ff";
    case 5:
      return "#fcc83b";
    default:
      return "#fff";
  }
}
