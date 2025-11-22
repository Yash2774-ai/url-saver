import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Button,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const SavedWebsites = () => {
  const [urls, setUrls] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedUrls, setExpandedUrls] = useState([]);
  const [editingUrl, setEditingUrl] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    url: "",
    description: "",
    tags: "",
    notes: "",
    category: "General",
  });

  // Fetch URLs
  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = () => {
    axios.get("http://localhost:5000/api/urls").then((res) => {
      setUrls(res.data);
    });
  };

  // Categories from URLs
  const categories = Array.from(
    new Set(urls.map((u) => u.category || "General"))
  );

  // Toggle category expand/collapse
  const toggleCategory = (cat) => {
    setExpandedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Toggle URL detail expand/collapse
  const toggleUrlDetail = (id) => {
    setExpandedUrls((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Delete URL with confirmation
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this website?")) {
      axios.delete(`http://localhost:5000/api/urls/${id}`).then(() => {
        setUrls(urls.filter((u) => u.id !== id));
      });
    }
  };

  // Edit click
  const handleEditClick = (url) => {
    setEditingUrl(url.id);
    setEditForm({
      title: url.title,
      url: url.url,
      description: url.description,
      tags: url.tags,
      notes: url.notes,
      category: url.category || "General",
    });
  };

  // Save edited URL
  const handleSaveEdit = (id) => {
    axios.put(`http://localhost:5000/api/urls/${id}`, editForm).then(() => {
      setUrls(urls.map((u) => (u.id === id ? { ...u, ...editForm, id } : u)));
      setEditingUrl(null);
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Saved Websites
      </Typography>

      {/* Render categories */}
      {categories.map((cat) => {
        const urlsInCat = urls.filter((u) => (u.category || "General") === cat);
        const isExpanded = expandedCategories.includes(cat);

        return (
          <Box key={cat} sx={{ mb: 2 }}>
            {/* Category header */}
            <Card
              sx={{
                cursor: "pointer",
                backgroundColor: "#f0f0f0",
                mb: 1,
              }}
              onClick={() => toggleCategory(cat)}
            >
              <CardContent>
                <Typography variant="h6">
                  {isExpanded ? "▼" : "►"} {cat} ({urlsInCat.length})
                </Typography>
              </CardContent>
            </Card>

            {/* URLs under category */}
            {isExpanded &&
              urlsInCat.map((url) => {
                const isUrlExpanded = expandedUrls.includes(url.id);
                return (
                  <Card
                    key={url.id}
                    sx={{
                      mb: 1,
                      ml: 2,
                      borderLeft: "5px solid #1976d2",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleUrlDetail(url.id)}
                  >
                    <CardContent>
                      <Typography variant="subtitle1">{url.title}</Typography>
                      {isUrlExpanded && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="primary">
                            <a href={url.url} target="_blank" rel="noopener noreferrer">
                              {url.url}
                            </a>
                          </Typography>
                          <Typography variant="body2">{url.description}</Typography>
                          {url.notes && (
                            <Typography variant="body2" color="textSecondary">
                              <strong>Notes:</strong> {url.notes}
                            </Typography>
                          )}
                          <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {url.tags &&
                              url.tags.split(",").map((tag, i) => (
                                <Chip key={i} label={tag.trim()} />
                              ))}
                          </Box>
                          <Box sx={{ mt: 1 }}>
                            <IconButton
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(url.id);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <IconButton
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(url);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Box>

                          {/* Edit Form */}
                          {editingUrl === url.id && (
                            <Box sx={{ mt: 2 }}>
                              <TextField
                                label="Title"
                                value={editForm.title}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, title: e.target.value })
                                }
                                fullWidth
                                sx={{ mb: 1 }}
                              />
                              <TextField
                                label="URL"
                                value={editForm.url}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, url: e.target.value })
                                }
                                fullWidth
                                sx={{ mb: 1 }}
                              />
                              <TextField
                                label="Description"
                                value={editForm.description}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, description: e.target.value })
                                }
                                fullWidth
                                sx={{ mb: 1 }}
                              />
                              <TextField
                                label="Tags"
                                value={editForm.tags}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, tags: e.target.value })
                                }
                                fullWidth
                                sx={{ mb: 1 }}
                              />
                              <TextField
                                label="Notes"
                                value={editForm.notes}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, notes: e.target.value })
                                }
                                fullWidth
                                sx={{ mb: 1 }}
                              />
                              <TextField
                                label="Category"
                                value={editForm.category}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, category: e.target.value })
                                }
                                fullWidth
                                sx={{ mb: 1 }}
                              />
                              <Button
                                variant="contained"
                                onClick={() => handleSaveEdit(url.id)}
                                sx={{ mr: 1 }}
                              >
                                Save
                              </Button>
                              <Button variant="outlined" onClick={() => setEditingUrl(null)}>
                                Cancel
                              </Button>
                            </Box>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </Box>
        );
      })}
    </Box>
  );
};

export default SavedWebsites;
