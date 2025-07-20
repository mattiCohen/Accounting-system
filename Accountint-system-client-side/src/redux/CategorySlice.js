import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCategories,
  fetchCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
} from './CategoryThunk';

const initialState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

const CategorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    // fetchCategories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
      });

    // fetchCategoryById
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch category by id';
      });

    // addCategory
    builder
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add category';
      });

    // updateCategory
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const { id, category } = action.payload;
        const index = state.categories.findIndex((cat) => cat.CategoryId === id);
        if (index !== -1) {
          state.categories[index] = category;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update category';
      });

    // deleteCategory
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (cat) => cat.CategoryId !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete category';
      });
  },
});

export const {  } = CategorySlice.actions;

export default CategorySlice.reducer;
