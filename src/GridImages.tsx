import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { Result } from "./types";
import ImageItem from "./ImageItem";

const GridImages = ({ stickers, resourceUrlPrefix }: Result) => {
  const breakpoints = Array(10)
    .fill(1)
    .map((_, index) => index)
    .reduce((obj, cur) => ({ ...obj, [`${cur}00`]: cur }), {});

  return (
    <>
      <ResponsiveMasonry columnsCountBreakPoints={breakpoints}>
        <Masonry gutter="10">
          {stickers.map((sticker) => {
            const imgUrl = `${resourceUrlPrefix}${sticker.fileName}`;
            return <ImageItem key={imgUrl} src={imgUrl} />;
          })}
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
};

export default GridImages;
