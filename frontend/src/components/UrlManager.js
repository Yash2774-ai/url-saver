import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Autocomplete,
} from "@mui/material";
import { Save } from "@mui/icons-material";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const DEFAULT_CATEGORIES = ["General", "Work", "Study", "AI", "Entertainment"];

const UrlManager = () => {
  const [urls, setUrls] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    category: "General",
  });

  useEffect(() => {
    axios.get(`${API_URL}/api/urls`).then((response) => {
      setUrls(response.data);
    });
  }, []);

  const categoryOptions = useMemo(() => {
    const existingCategories = urls
      .map((item) => (item.category || "").trim())
      .filter(Boolean);

    return Array.from(new Set([...DEFAULT_CATEGORIES, ...existingCategories]));
  }, [urls]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(`${API_URL}/api/urls`, formData);
    setUrls((prev) => [response.data, ...prev]);
    setFormData({
      title: "",
      url: "",
      description: "",
      category: "General",
    });
    alert("Website saved successfully!");
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Add a New Website
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Website URL"
              fullWidth
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              options={categoryOptions}
              value={formData.category}
              onInputChange={(_, value) =>
                setFormData({ ...formData, category: value || "General" })
              }
              onChange={(_, value) =>
                setFormData({
                  ...formData,
                  category:
                    typeof value === "string"
                      ? value
                      : value?.label || value || "General",
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  helperText="Choose an existing category or type a new one"
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Save />}
              sx={{ mt: 1 }}
            >
              Save Website
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default UrlManager;
