import { atom } from "recoil";
import { GetStickerResponse } from "../types";

interface MetaData {
  thumbnailImageUrl: string;
}

export interface AutocompleteItem
  extends Pick<GetStickerResponse["result"], "authorName" | "name" | "packId">,
    MetaData {}

export const autocompleteState = atom<null | AutocompleteItem[]>({
  key: "autocompleteState",
  default: null
});
