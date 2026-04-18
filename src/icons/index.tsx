import {
  MdHome,
  MdExplore,
  MdSearch,
  MdStar,
  MdHelp,
  MdLogout,
  MdAdd,
  MdBarChart,
  MdAttachFile,
} from "react-icons/md";


export const icons = {
  home: MdHome,
  explore: MdExplore,
  search: MdSearch,
  star: MdStar,
  help: MdHelp,
  logout: MdLogout,
  plus: MdAdd,
  dashboard: MdBarChart,
  report: MdAttachFile,
} as const;
export type IconName = keyof typeof icons;