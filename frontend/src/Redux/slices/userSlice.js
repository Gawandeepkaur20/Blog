import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
   async (username, thunkAPI) => {
    try {
      const res = await axios.get(`http://localhost:5000/user/profile/${username}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.posts = action.payload.posts;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || action.error.message;
});

  }
});

export default userSlice.reducer;
