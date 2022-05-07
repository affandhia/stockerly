import { useRecoilValue, useRecoilState } from "recoil";
import { useQuery } from "react-query";
import {
  LinearProgress,
  Fade,
  Collapse,
  Box,
  Alert,
  AlertTitle
} from "@mui/material";
import axios from "axios";
import { useLocalStorage } from "react-use";

import {
  fetchConfigState,
  autocompleteState,
  AutocompleteItem
} from "./recoil";
import { GetStickerResponse } from "./types";
import {
  DETAIL,
  CONFIG__MAX_AUTOCOMPLETE_ITEM,
  DATA__AUTOCOMPLETE_ITEM
} from "./constants";
import GridImages from "./GridImages";
import { useEffect } from "react";

const useConfig = () => {
  const curlConfig = useRecoilValue(fetchConfigState);

  return curlConfig;
};

const useAutocomplete = (isLoading: boolean, data?: GetStickerResponse) => {
  const [autocomplete, setAutocomplete] = useRecoilState(autocompleteState);
  const [local, setLocal] = useLocalStorage<AutocompleteItem[]>(
    DATA__AUTOCOMPLETE_ITEM,
    []
  );
  const [maxItem] = useLocalStorage<number>(CONFIG__MAX_AUTOCOMPLETE_ITEM, 10);

  /** INIT AUTOCOMPLETE */
  useEffect(() => {
    if (autocomplete == null && local) {
      // if the list is null because it has not been initialized
      // init list here
      setAutocomplete(local);
    }
  }, [autocomplete, local, setAutocomplete]);

  /** SYNC TO LOCAL STORAGE */
  useEffect(() => {
    if (autocomplete != null) {
      // if there is a changes in autocomplete
      setLocal(autocomplete);
    }
  }, [autocomplete, setLocal]);

  /** SYNC TO RECOIL */
  useEffect(() => {
    if (isLoading === false && data?.result) {
      // if the fetch is success
      const {
        authorName,
        packId,
        name,
        resourceUrlPrefix,
        stickers
      } = data.result;
      const item = {
        authorName,
        packId,
        name,
        thumbnailImageUrl: `${resourceUrlPrefix}${
          stickers.length && stickers[0].fileName
        }`
      };
      if (autocomplete?.length && autocomplete[0].packId !== packId) {
        // if the list is different from before
        setAutocomplete(
          [
            item,
            ...autocomplete.filter((item) => item.packId !== packId)
          ].slice(0, maxItem)
        );
      } else if (autocomplete?.length === 0) setAutocomplete([item]); // if the list from local is empty
    }
  }, [autocomplete, setAutocomplete, isLoading, data, maxItem]);
};

const Detail = () => {
  const fetchConfig = useConfig();

  const { isLoading, error, data } = useQuery<GetStickerResponse>(
    [DETAIL, fetchConfig],
    async () => {
      const response = await axios({
        url: fetchConfig!.url,
        headers: fetchConfig!.headers
      }).then((response) => response.data);

      if (response.error) throw new Error(JSON.stringify(response.error));
      return response;
    },
    {
      enabled: !!fetchConfig
    }
  );

  useAutocomplete(isLoading, data);

  return (
    <>
      <Fade in={isLoading}>
        <LinearProgress />
      </Fade>
      <Collapse in={!!error}>
        <Alert severity="error">
          <AlertTitle>Network Error</AlertTitle>
          <strong>Unable to get the images</strong>
        </Alert>
      </Collapse>
      <Collapse in={!!data}>
        <Box sx={{ paddingBottom: "10em" }}>
          {data?.result?.stickers && <GridImages {...data.result} />}
        </Box>
      </Collapse>
    </>
  );
};

export default Detail;
