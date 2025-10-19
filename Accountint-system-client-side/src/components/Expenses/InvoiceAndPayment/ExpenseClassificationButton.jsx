import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from "../../../redux/CategoryThunk";
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ExpenseClassificationButton = ({ sx, selectedCategory, setSelectedCategory,isSupplierCard }) => {
    const isInSupplier = useSelector(state => state.Suppliers.IsInSupliers);
    const isLoading = useSelector(state => state.category.loading);
    const isError = useSelector(state => state.category.error);
    const dispatch = useDispatch();
    const allCategory = useSelector(state => state.category.categories);
    const filteredCategories =
        allCategory.filter(category =>
            category.categoryClassification === (isInSupplier ? 2 : 1));
    const handleChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    if (isLoading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
                color: "black"
            }}>
                <CircularProgress style={{ color: "black" }} />
            </div>
        );

    }

    if (isError) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "black",
                marginTop: "1rem"
            }}>
                <ErrorOutlineIcon style={{ marginRight: "0.5rem" }} />
                <span>שגיאת מערכת</span>
            </div>
        );
    }

    return (
        <div style={{ width: '100%' }}>
            <Typography
                variant="h6"
                sx={{
                    textAlign: 'right',
                    color: 'black',
                    fontSize: '1.125rem', // ≈ 18px
                    marginBottom: '0.5rem',
                    marginRight: isSupplierCard ? '4.3rem' : undefined,
                }}
            >
                {isInSupplier ? "סיווג הוצאה" : "סיווג הכנסה"}
            </Typography>

            <FormControl
                fullWidth
                variant="outlined"
                sx={sx}
            >
                <InputLabel sx={{ fontSize: '1rem' }}></InputLabel>
                <Select
                    sx={{ fontSize: '1rem', textAlign: 'right' }}
                    value={
                        filteredCategories.some(c => c.categoryId === selectedCategory)
                            ? selectedCategory
                            : ""   // ברירת מחדל חוקית
                    }
                    onChange={handleChange}
                    displayEmpty
                >
                    <MenuItem value="">
                        <em>בחר קטגוריה</em>
                    </MenuItem>

                    {filteredCategories.map((category) => (
                        <MenuItem key={category.categoryId} value={category.categoryId}>
                            {category.categoryName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default ExpenseClassificationButton;
