import {
  IoHomeOutline,
  IoCompassOutline,
  IoSearchOutline,
  IoStarOutline,
  IoHelpCircleOutline,
  IoLogOutOutline,
  IoAddOutline,
  IoPieChartOutline,
  IoBarChartOutline,
  IoAttachOutline,
  IoEllipsisHorizontalOutline,
  IoTrashOutline,
  IoSettingsOutline,
  IoFunnelOutline,
  IoCalendarOutline,
  IoClose,
  IoCheckmarkCircleOutline,
  IoDocumentOutline,
} from "react-icons/io5";

import { MdModeEditOutline } from "react-icons/md";


export const icons = {
  home: IoHomeOutline,
  explore: IoCompassOutline,
  search: IoSearchOutline,
  star: IoStarOutline,
  help: IoHelpCircleOutline,
  logout: IoLogOutOutline,
  plus: IoAddOutline,
  piechart: IoPieChartOutline,
  barchart: IoBarChartOutline,
  report: IoAttachOutline,
  more: IoEllipsisHorizontalOutline,
  trash: IoTrashOutline,
  edit: MdModeEditOutline,
  settings: IoSettingsOutline,
  sort: IoFunnelOutline,
  calendar: IoCalendarOutline,
  close: IoClose,
  checkCircle: IoCheckmarkCircleOutline,
  file: IoDocumentOutline,
} as const;
export type IconName = keyof typeof icons;