import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import { Save } from "@mui/icons-material";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const CATEGORY_OPTIONS = ["General", "Work", "Study", "AI", "Entertainment"];

const UrlManager = () => {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    tags: "",
    notes: "",
    category: "General",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/api/urls`, formData);
    setFormData({
      title: "",
      url: "",
      description: "",
      tags: "",
      notes: "",
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

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Category"
              fullWidth
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {CATEGORY_OPTIONS.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Tags (comma separated)"
              fullWidth
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes or reminders..."
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
