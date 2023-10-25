import React from "react";
import { styled } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useDimensions from "react-use-dimensions";
import Header from "./Header.js";
import IconSidebar from "./IconSidebar.js";
import RightSidebar from "./RightSidebar.js";
import WorkContainer from "./WorkContainer.js";
import { IconDictionaryContext } from "react-material-workspace-layout/icon-dictionary.js";

const emptyAr = [];
const emptyObj = {};
const theme = createTheme();

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
  maxWidth: "100vw",
}));
const SidebarsAndContent = styled("div")(({ theme }) => ({
  display: "flex",
  flexGrow: 1,
  width: "100%",
  height: "100%",
  overflow: "hidden",
  maxWidth: "100vw",
}));

const Workspace = ({
  style = emptyObj,
  iconSidebarItems = emptyAr,
  selectedTools = ["select"],
  headerItems = emptyAr,
  rightSidebarItems = emptyAr,
  onClickHeaderItem,
  onClickIconSidebarItem,
  headerLeftSide = null,
  iconDictionary = emptyObj,
  rightSidebarExpanded,
  hideHeader = false,
  hideHeaderText = false,
  children,
}) => {
  const [sidebarAndContentRef, sidebarAndContent] = useDimensions();
  return (
    <ThemeProvider theme={theme}>
      <IconDictionaryContext.Provider value={iconDictionary}>
        <Container>
          {/* {!hideHeader && (
            <Header
              hideHeaderText={hideHeaderText}
              leftSideContent={headerLeftSide}
              onClickItem={onClickHeaderItem}
              items={headerItems}
            />
          )} */}
          <SidebarsAndContent ref={sidebarAndContentRef}>
            <WorkContainer>{children}</WorkContainer>
            {/* {rightSidebarItems.length === 0 ? null : (
              <RightSidebar
                initiallyExpanded={rightSidebarExpanded}
                height={sidebarAndContent.height || 0}
              >
                {rightSidebarItems}
              </RightSidebar>
            )} */}

            {iconSidebarItems.length === 0 ? null : (
              <IconSidebar
                onClickItem={onClickIconSidebarItem}
                selectedTools={selectedTools}
                items={iconSidebarItems}
              />
            )}
          </SidebarsAndContent>
        </Container>
      </IconDictionaryContext.Provider>
    </ThemeProvider>
  );
};

export default Workspace;
