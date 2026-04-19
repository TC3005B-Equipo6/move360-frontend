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
  MdMoreHoriz,
  MdDeleteOutline,
  MdModeEditOutline,
  MdSettings,
  MdSort,
  MdCalendarMonth
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
  more: MdMoreHoriz,
  trash: MdDeleteOutline,
  edit: MdModeEditOutline,
  settings: MdSettings,
  sort: MdSort,
  calendar: MdCalendarMonth,
} as const;
export type IconName = keyof typeof icons;