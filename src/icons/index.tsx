import { MdHome, MdExplore, MdSearch, MdStar, MdHelp, MdLogout, MdAdd } from "react-icons/md";


export const icons = {
  home: MdHome,
  explore: MdExplore,
  search: MdSearch,
  star: MdStar,
  help: MdHelp,
  logout: MdLogout,
  plus: MdAdd,
} as const;
export type IconName = keyof typeof icons;