import React, { useState } from "react";
import UrlManager from "./components/UrlManager";
import SavedWebsites from "./components/SavedWebsites";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";

const App = () => {
  const [section, setSection] = useState("add");

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f6fa" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            bgcolor: "#1976d2",
            color: "white",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            Web Manager
          </Typography>
        </Toolbar>
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />

        <List>
          <ListItemButton
            selected={section === "add"}
            onClick={() => setSection("add")}
          >
            <ListItemText primary="Add Website" />
          </ListItemButton>

          <ListItemButton
            selected={section === "saved"}
            onClick={() => setSection("saved")}
          >
            <ListItemText primary="Saved Websites" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 4, overflowY: "auto" }}>
        {section === "add" && <UrlManager />}
        {section === "saved" && <SavedWebsites />}
      </Box>
    </Box>
  );
};

export default App;
