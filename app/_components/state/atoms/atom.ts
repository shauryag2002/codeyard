import { atom } from "recoil";
export const SideBarAtom = atom({
    key: "openAtom",
    default: false,
});
export const UserAtom = atom({
    key: "userAtom",
    default: [],
});
export const loadingAtom = atom({
    key: "loadingAtom",
    default: false,
});
export const notiAtom = atom({
    key: "notiAtom",
    default: 0,
});