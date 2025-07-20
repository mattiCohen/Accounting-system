import { createSlice } from '@reduxjs/toolkit';
import { fetchCards,
     fetchOneCard, 
     addCard,
      updateCard,
       deleteCard } from './CardThunk';

const initialState = {
  cards: [],
  selectedCard: null,
  loading: false,
  error: false,
};

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchCards.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
        state.error = false;
      })
      .addCase(fetchCards.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })

      // Fetch one
      .addCase(fetchOneCard.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchOneCard.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCard = action.payload;
        state.error = false;
      })
      .addCase(fetchOneCard.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })

      // Add
      .addCase(addCard.fulfilled, (state, action) => {
        state.cards.push(action.payload);
        state.error = false;
        state.loading=false;
      })
      .addCase(addCard.rejected, (state) => {
        state.error = true;
      })

        .addCase(addCard.pending, (state) => {
        state.loading = true;
        state.error = false;
        })

      // Update
      .addCase(updateCard.fulfilled, (state, action) => {
        const index = state.cards.findIndex(c => c.CardId === action.payload.CardId);
        if (index !== -1) state.cards[index] = action.payload;
        state.error = false;
      })
      .addCase(updateCard.rejected, (state) => {
        state.error = true;
      })

        .addCase(updateCard.pending, (state) => {
        state.loading = true;
        state.error = false;
        })

      // Delete
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.cards = state.cards.filter(c => c.CardId !== action.payload);
        state.error = false;
      })
      .addCase(deleteCard.rejected, (state) => {
        state.error = true;
      })
        .addCase(deleteCard.pending, (state) => {
            state.loading = true;
            state.error = false;
        });
  },
});

export const { } = cardsSlice.actions;
export default cardsSlice.reducer;
