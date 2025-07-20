import {
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    IconButton,
    Typography,
    Grid,
    Box,
    Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCategories,
    addCategory,
    deleteCategory,
    updateCategory,
} from "../redux/CategoryThunk";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { color } from "framer-motion";

const SettingsPage = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);

    const [newCategoryName, setNewCategoryName] = useState("");
    const [classificationId, setClassificationId] = useState(1); // 1 = הוצאה, 2 = הכנסה
    const [filter, setFilter] = useState("all");
    const [editStates, setEditStates] = useState({});

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        await dispatch(
            addCategory({
                categoryName: newCategoryName,
                categoryClassification: classificationId,
                categoryClassificationNavigation: {
                    classificationId: classificationId,
                    classificationName: newCategoryName
                }
            })
        ).unwrap();
        setNewCategoryName("");
        setClassificationId(1);
        await dispatch(fetchCategories()).unwrap();
                console.log(categories)

    };

    const handleDelete = async (id) => {
        await dispatch(deleteCategory(id)).unwrap();
        await dispatch(fetchCategories()).unwrap();
    };

    const startEdit = (id, name) => {
        setEditStates((prev) => ({
            ...prev,
            [id]: { name, editing: true },
        }));
    };

    const cancelEdit = (id) => {
        setEditStates((prev) => ({
            ...prev,
            [id]: { ...prev[id], editing: false },
        }));
    };

    const saveEdit = async(id) => {
            const updatedName = editStates[id].name.trim();
  if (updatedName) {
    const category = categories.find((c) => c.categoryId === id); // <- הנה

           await  dispatch(
                updateCategory({
                    id,
                    category: {
                        categoryId: id,
                        categoryName: updatedName,
                        categoryClassification: category.categoryClassification, 
                        categoryClassificationNavigation: {
                            classificationId: category.categoryClassification,
                            classificationName: updatedName
                        }
                    },
                })
            ).unwrap();
            cancelEdit(id);
            await dispatch(fetchCategories()).unwrap();
        }
    };

    const filteredCategories =
        filter === "all"
            ? categories
            : categories.filter(
                (cat) =>
                    cat.categoryClassification === (filter === "income" ? 1 : 2)
            );

    return (
        <Box sx={{ padding: 4, textAlign: "center", backgroundColor: '#F3BBB3', }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                ניהול קטגוריות
            </Typography>

            {/* טופס הוספה */}
            <Box
                display="flex"
                justifyContent="center"
                gap={2}
                mb={4}
                flexWrap="wrap"
            >
                <TextField
                    label="שם קטגוריה"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    variant="outlined"
                    sx={{ minWidth: 200 }}
                />
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>סוג</InputLabel>
                    <Select
                        value={classificationId}
                        label="סוג"
                        onChange={(e) => setClassificationId(e.target.value)}
                    >
                        <MenuItem value={2}>הוצאה (ספקים)</MenuItem>
                        <MenuItem value={1}>הכנסה (לקוחות)</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    onClick={handleAddCategory}
                    sx={{
                        backgroundColor: "#DA9F9A",
                        color: "white",
                        "&:hover": { backgroundColor: "#c58581" },
                        fontSize: "0.9rem",
                        
                    }}
                >
                    הוסף קטגוריה
                </Button>
            </Box>

            {/* פילטר */}
            <Box display="flex" justifyContent="center" gap={1} mb={3} flexWrap="wrap">
                <Button
                    variant={filter === "all" ? "contained" : "outlined"}
                    onClick={() => setFilter("all")}
                    sx={{
                        backgroundColor: filter === "all" ? "#F8D5D1" : "transparent",
                        color: "#5C3D3D",
                        borderColor: "#F8D5D1",
                         '&:hover': {
                backgroundColor: '#D19793',
                borderColor: "#F8D5D1",
              },
                    }}
                >
                    הצג הכל
                </Button>
                <Button
                    variant={filter === "expense" ? "contained" : "outlined"}
                    onClick={() => setFilter("expense")}
                    sx={{
                        backgroundColor: filter === "expense" ? "#F8D5D1" : "transparent",
                        color: "#5C3D3D",
                        borderColor: "#F8D5D1",
                         '&:hover': {
                backgroundColor: '#D19793',
                borderColor: "#F8D5D1",
              },
                    }}
                >
                    הוצאות
                </Button>
                <Button
                    variant={filter === "income" ? "contained" : "outlined"}
                    onClick={() => setFilter("income")}
                    sx={{
                        backgroundColor: filter === "income" ? "#F8D5D1" : "transparent",
                        color: "#5C3D3D",
                        borderColor: "#F8D5D1",
                         '&:hover': {
                backgroundColor: '#D19793',
                borderColor: "#F8D5D1",
              },
                    }}
                >
                    הכנסות
                </Button>
            </Box>

            {/* רשימת קטגוריות */}
            <Grid container spacing={2} justifyContent="center" sx={{marginTop: '3rem',marginLeft: '4rem',marginRight: '4rem'}}>
                {filteredCategories.map((cat) => (
                    <Grid item xs={12} md={6} key={cat.categoryId}>
                        <Paper
                            elevation={2}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: 2,
                                borderRadius: 3,
                                backgroundColor: "#FFF8F8",
                            }}
                        >
                            {editStates[cat.categoryId]?.editing ? (
                                <TextField
                                    value={editStates[cat.categoryId].name}
                                    onChange={(e) =>
                                        setEditStates((prev) => ({
                                            ...prev,
                                            [cat.categoryId]: {
                                                ...prev[cat.categoryId],
                                                name: e.target.value,
                                            },
                                        }))
                                    }
                                    size="small"
                                    sx={{ flexGrow: 1, marginRight: 2 }}
                                />
                            ) : (
                                <Typography sx={{ color: "#5C3D3D" }}>
                                    {cat.categoryName} -{" "}
                                    {cat.categoryClassification === 1 ? "הוצאה" : "הכנסה"}
                                </Typography>
                            )}

                            <Box>
                                {editStates[cat.categoryId]?.editing ? (
                                    <>
                                        <IconButton onClick={() => saveEdit(cat.categoryId)}>
                                            <SaveIcon sx={{color:'#000'}}/>
                                        </IconButton >
                                        <IconButton onClick={() => cancelEdit(cat.categoryId)}>
                                            <CancelIcon sx={{color:'#000'}} />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <IconButton
                                            onClick={() =>
                                                startEdit(cat.categoryId, cat.categoryName)
                                            }
                                        >
                                            <EditIcon sx={{color:'#000'}} />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(cat.categoryId)}>
                                            <DeleteIcon  sx={{color:'#000'}}/>
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default SettingsPage;
