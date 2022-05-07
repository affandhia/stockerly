import { TextField, Collapse, FormControlLabel, Switch } from "@mui/material";
import { Autocomplete, Box, AppBar, Toolbar } from "@mui/material";
import debounce from "lodash/debounce";
import { useRecoilState, useRecoilValue } from "recoil";
import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { createFilterOptions } from "@mui/material/Autocomplete";

import {
  fetchConfigState,
  autocompleteState,
  AutocompleteItem
} from "./recoil";

import { CONFIG__IS_FORCE_ID_SEARCH } from "./constants";

const filter = createFilterOptions<AutocompleteItem>();

const StickerId = () => {
  const [isVisible, setVisible] = useLocalStorage(
    CONFIG__IS_FORCE_ID_SEARCH,
    true
  );
  const autocomplete = useRecoilValue(autocompleteState);
  const [idSearch, setIdSearch] = useState<string>();
  const [, setFetch] = useRecoilState(fetchConfigState);

  const updateSearch = useCallback(
    debounce((idSearch) => {
      if (isVisible) {
        setFetch({
          isForceIdSearch: true,
          headers: {},
          url: `https://api.sticker.ly/v3.1/stickerPack/${idSearch}`
        });
      }
    }, 500),
    [isVisible, setFetch]
  );

  useEffect(() => {
    updateSearch(idSearch);
  }, [idSearch, updateSearch]);

  useEffect(() => {
    if (autocomplete?.length) {
      const { packId } = autocomplete[0];
      setIdSearch(packId);
    }
  }, []);

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={isVisible}
            onChange={(event) => {
              setVisible(event.target.checked);
            }}
            name="checkedA"
          />
        }
        label="Search by ID"
      />
      <Collapse in={isVisible}>
        <AppBar
          position="fixed"
          color="primary"
          sx={{ top: "auto", bottom: 0 }}
        >
          <Box sx={{ p: 1 }}>
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              getOptionLabel={(option) => option.packId}
              onChange={(_, value) => {
                if (typeof value === "string") {
                  setIdSearch(value);
                } else if (value) setIdSearch(value.packId);
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                  (option) => inputValue === option.packId
                );
                if (inputValue !== "" && !isExisting) {
                  filtered.push({
                    packId: inputValue,
                    name: "search for this ID",
                    authorName: "press enter",
                    thumbnailImageUrl: ""
                  });
                }

                return filtered;
              }}
              renderOption={(props, option) => (
                <Box sx={{ display: "flex", flexDirection: "row" }} {...props}>
                  <Box
                    sx={{
                      paddingRight: "0.5em",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <img
                      src={option.thumbnailImageUrl}
                      width="16"
                      height="16"
                    />
                  </Box>
                  <Box>{`[ ${option.packId} ] ${option.name} – ${option.authorName}`}</Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Sticker ID" />
              )}
              options={autocomplete ?? []}
            />
          </Box>
        </AppBar>
      </Collapse>
    </>
  );
};

export default StickerId;
