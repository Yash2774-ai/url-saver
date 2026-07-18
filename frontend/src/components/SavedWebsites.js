import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Button,
  TextField,
  Grid,
  InputAdornment,
  Stack,
  Link,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const DEFAULT_CATEGORIES = ["General", "Work", "Study", "AI", "Entertainment"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "az", label: "Alphabetical (A-Z)" },
  { value: "za", label: "Alphabetical (Z-A)" },
];

const emptyStats = {
  total: 0,
  favorites: 0,
  categories: [],
};

const SavedWebsites = () => {
  const [urls, setUrls] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [editingUrl, setEditingUrl] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    url: "",
    description: "",
    category: "General",
    is_favorite: 0,
  });

  useEffect(() => {
    fetchUrls();
    fetchStats();
  }, []);

  const fetchUrls = async () => {
    const response = await axios.get(`${API_URL}/api/urls`);
    setUrls(response.data);
  };

  const fetchStats = async () => {
    const response = await axios.get(`${API_URL}/api/urls/stats`);
    setStats({ ...emptyStats, ...response.data });
  };

  const refreshData = async () => {
    await Promise.all([fetchUrls(), fetchStats()]);
  };

  const categoryOptions = useMemo(() => {
    const fromUrls = urls
      .map((item) => (item.category || "").trim())
      .filter(Boolean);

    return ["All", ...Array.from(new Set([...DEFAULT_CATEGORIES, ...fromUrls]))];
  }, [urls]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this website?")) {
      return;
    }

    await axios.delete(`${API_URL}/api/urls/${id}`);
    await refreshData();
  };

  const handleEditClick = (url) => {
    setEditingUrl(url.id);
    setEditForm({
      title: url.title || "",
      url: url.url || "",
      description: url.description || "",
      category: url.category || "General",
      is_favorite: url.is_favorite ? 1 : 0,
    });
  };

  const handleSaveEdit = async (id) => {
    await axios.put(`${API_URL}/api/urls/${id}`, editForm);
    setEditingUrl(null);
    await refreshData();
  };

  const handleToggleFavorite = async (url) => {
    const nextFavorite = url.is_favorite ? 0 : 1;
    await axios.patch(`${API_URL}/api/urls/${url.id}/favorite`, {
      is_favorite: nextFavorite,
    });

    setUrls((prev) =>
      prev.map((item) =>
        item.id === url.id ? { ...item, is_favorite: nextFavorite } : item
      )
    );
    await fetchStats();
  };

  const filteredUrls = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const results = urls.filter((url) => {
      const category = url.category || "General";
      const matchesCategory =
        selectedCategory === "All" || category === selectedCategory;

      const haystack = [url.title, url.url, url.description, url.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 || haystack.includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });

    return results.sort((a, b) => {
      if ((b.is_favorite ? 1 : 0) !== (a.is_favorite ? 1 : 0)) {
        return (b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0);
      }

      switch (sortBy) {
        case "oldest":
          return a.id - b.id;
        case "az":
          return (a.title || "").localeCompare(b.title || "");
        case "za":
          return (b.title || "").localeCompare(a.title || "");
        case "newest":
        default:
          return b.id - a.id;
      }
    });
  }, [searchTerm, selectedCategory, sortBy, urls]);

  const statCards = [
    { label: "Total Websites", value: stats.total },
    { label: "Favorite Websites", value: stats.favorites },
    ...stats.categories.map((item) => ({
      label: item.category || "General",
      value: item.count,
    })),
  ];

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Typography variant="h5" gutterBottom>
        Saved Websites
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.label}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography color="text.secondary" variant="body2" gutterBottom>
                  {card.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {card.value || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Search websites"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, URL, description, or category"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Sort by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <Autocomplete
                freeSolo
                options={categoryOptions}
                value={selectedCategory}
                onInputChange={(_, value) => setSelectedCategory(value || "All")}
                onChange={(_, value) => setSelectedCategory(value || "All")}
                renderInput={(params) => (
                  <TextField {...params} label="Filter category" />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {categoryOptions.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    color={selectedCategory === category ? "primary" : "default"}
                    variant={selectedCategory === category ? "filled" : "outlined"}
                    onClick={() => setSelectedCategory(category)}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {filteredUrls.map((url) => (
          <Grid item xs={12} md={6} key={url.id}>
            <Card
              sx={{
                height: "100%",
                borderLeft: `5px solid ${url.is_favorite ? "#fbc02d" : "#1976d2"}`,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h6">{url.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {url.category || "General"}
                    </Typography>
                  </Box>

                  <IconButton
                    color={url.is_favorite ? "warning" : "default"}
                    onClick={() => handleToggleFavorite(url)}
                    aria-label="toggle favorite"
                  >
                    {url.is_favorite ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                </Box>

                <Link
                  href={url.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  {url.url}
                </Link>

                {url.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {url.description}
                  </Typography>
                )}

                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <IconButton color="primary" onClick={() => handleEditClick(url)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(url.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>

                {editingUrl === url.id && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      label="Title"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      fullWidth
                      sx={{ mb: 1.5 }}
                    />
                    <TextField
                      label="URL"
                      value={editForm.url}
                      onChange={(e) =>
                        setEditForm({ ...editForm, url: e.target.value })
                      }
                      fullWidth
                      sx={{ mb: 1.5 }}
                    />
                    <TextField
                      label="Description"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      fullWidth
                      sx={{ mb: 1.5 }}
                    />
                    <Autocomplete
                      freeSolo
                      options={categoryOptions.filter((category) => category !== "All")}
                      value={editForm.category}
                      onInputChange={(_, value) =>
                        setEditForm({ ...editForm, category: value || "General" })
                      }
                      onChange={(_, value) =>
                        setEditForm({ ...editForm, category: value || "General" })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Category"
                          sx={{ mb: 1.5 }}
                        />
                      )}
                    />
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button variant="contained" onClick={() => handleSaveEdit(url.id)}>
                        Save
                      </Button>
                      <Button variant="outlined" onClick={() => setEditingUrl(null)}>
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredUrls.length === 0 && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography color="text.secondary">
              No websites match the current search or filter.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default SavedWebsites;
