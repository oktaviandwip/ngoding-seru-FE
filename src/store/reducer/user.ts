import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AddressKey = "Address1" | "Address2" | "Address3";

type UserProfile = {
  Id: string;
  Email: string;
  Password: string;
  Phone_number: string;
  Role: string;
  Image: string;
  Address1: string;
  Address2: string;
  Address3: string;
  Full_name: string;
  Username: string;
  Birthday: string;
  Gender: string;
  Created_at: string;
  Updated_at: string | null;
};

interface UserState {
  profile: UserProfile | null;
}

const initialState: UserState = {
  profile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getProfile(state, action: PayloadAction<UserProfile | null>) {
      state.profile = action.payload;
    },
    updateName(state, action: PayloadAction<string>) {
      if (state.profile) {
        state.profile.Full_name = action.payload;
      }
    },
    updatePhoneNumber(state, action: PayloadAction<string>) {
      if (state.profile) {
        state.profile.Phone_number = action.payload;
      }
    },
    updateAddress(
      state,
      action: PayloadAction<{ addressKey: AddressKey; addressValue: string }>
    ) {
      if (state.profile) {
        state.profile[action.payload.addressKey] = action.payload.addressValue;
      }
    },
  },
});

export const { getProfile, updateAddress, updatePhoneNumber, updateName } = userSlice.actions;
export default userSlice.reducer;
