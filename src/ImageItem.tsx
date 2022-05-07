import LazyLoad from "react-lazyload";
import { Card, CardActionArea, CardActions, IconButton } from "@mui/material";
import { FileCopy, PhotoSizeSelectLarge } from "@mui/icons-material";
import { useCallback, useRef, useEffect } from "react";
import axios from "axios";

const useCopyImage = ({ src }: { src: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      if (canvas.getContext) {
        const ctx2d = canvas.getContext("2d")!;

        const img1 = new Image();

        img1.onload = function () {
          //draw background image
          ctx2d.drawImage(img1, 0, 0, 100, 100);
        };

        img1.crossOrigin = "anonymous";
        img1.src = src;
      }
    }
  }, [src]);

  const handleCopyImage = useCallback(async () => {
    console.log("downloading image", src);
    const response = await axios.get(src, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
      }
    });
    // if (canvasRef.current) {
    //   const canvas = canvasRef.current;
    //   canvas.toBlob(
    //     async (blob) => {
    //       try {
    //         console.log({ blob });
    //         const image = new window.ClipboardItem({
    //           [blob.type]: blob
    //         });
    //         const result = await navigator.permissions.query({
    //           name: "clipboard-write"
    //         });
    //         if (result.state === "granted") {
    //           await navigator.clipboard.write([image]);
    //           console.log("Image copied");
    //         } else {
    //           console.log("clipboard-permissoin not granted: ", { result });
    //         }
    //       } catch (error) {
    //         console.error(error);
    //       }
    //     },
    //     "image/png",
    //     0.75
    //   );
    // }
  }, [src]);

  return { handleCopyImage, canvasRef, imgRef, imgContainerRef };
};

const ImageItem = ({ src }) => {
  const { handleCopyImage, canvasRef, imgRef, imgContainerRef } = useCopyImage({
    src
  });

  return (
    <>
      <Card>
        <CardActionArea>
          <div ref={imgContainerRef} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <LazyLoad height={200}>
            <img ref={imgRef} src={src} width="100%" />
          </LazyLoad>
        </CardActionArea>
        <CardActions>
          <IconButton
            onClick={handleCopyImage}
            color="secondary"
            component="span"
          >
            <FileCopy />
          </IconButton>
          <a target="_blank" href={` https://ezgif.com/resize?url=${src}`}>
            <IconButton color="secondary" component="span">
              <PhotoSizeSelectLarge />
            </IconButton>
          </a>
        </CardActions>
      </Card>
    </>
  );
};

export default ImageItem;
