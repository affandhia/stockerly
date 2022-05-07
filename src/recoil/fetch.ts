import { atom } from "recoil";

interface CurlConverterString {
  url: string;
  headers: Record<string, string>;
  isForceIdSearch?: boolean;
}

export const fetchConfigState = atom<null | CurlConverterString>({
  key: "fetchConfigState", // unique ID (with respect to other atoms/selectors)
  default: null // default value (aka initial value)
});
