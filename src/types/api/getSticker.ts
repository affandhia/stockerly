export interface GetStickerResponse {
  result: Result;
}

export interface Result {
  animated: boolean;
  authorName: string;
  isAnimated: boolean;
  name: string;
  owner: string;
  packId: string;
  resourceUrlPrefix: string;
  resourceVersion: number;
  resourceZip: string;
  shareUrl: string;
  stickers: Sticker[];
  telegramScheme: string;
  thumb: boolean;
  trayIndex: number;
  updated: number;
  website: string;
}

export interface Sticker {
  animated: boolean;
  fileName: string;
  isAnimated: boolean;
  liked: boolean;
  sid: string;
  tags: string[];
  viewCount: number;
}
