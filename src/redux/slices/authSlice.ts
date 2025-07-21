import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Address {
  address: string;
  location: string;
  country: string;
  state: string;
  city: string;
  pin: string;
}

interface AuthState {
  isAuthenticated: boolean;
  userId: number | null;
  phone?: string | null;
  email?: string | null;
  membershipType?: string | null;
  createdAt?: string | null;
  regKey?: string | null;
  regNo?: string | null;
  token?: string | null;
  userName?: string | null;
  image?: string | null;
  address?: Address;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  phone: null,
  email: null,
  membershipType: null,
  createdAt: null,
  regKey: null,
  regNo: null,
  token: null,
  userName: null,
  image: null,
  address: {
    address: '',
    location: '',
    country: '',
    state: '',
    city: '',
    pin: '',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        token: string;
        member: {
          id: number;
          name: string;
          phone: string;
          email: string | null;
          membership_type: string;
          created_at: string;
          reg_key: string;
          reg_no: string;
          image: string | null;
          address: string;
          location: string;
          country: string;
          state: string;
          city: string;
          pin: string;
        };
      }>
    ) {
      const { token, member } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.userId = member.id;
      state.userName = member.name;
      state.phone = member.phone;
      state.email = member.email;
      state.membershipType = member.membership_type;
      state.createdAt = member.created_at;
      state.regKey = member.reg_key;
      state.regNo = member.reg_no;
      state.image = member.image;
      state.address = {
        address: member.address,
        location: member.location,
        country: member.country,
        state: member.state,
        city: member.city,
        pin: member.pin,
      };
    },

    logout(state) {
      state.isAuthenticated = false;
      state.userId = null;
      state.token = null;
      state.userName = null;
      state.phone = null;
      state.email = null;
      state.membershipType = null;
      state.createdAt = null;
      state.regKey = null;
      state.regNo = null;
      state.image = null;
      state.address = {
        address: '',
        location: '',
        country: '',
        state: '',
        city: '',
        pin: '',
      };
    },

    updateAddress(state, action: PayloadAction<Address>) {
      state.address = action.payload;
    },
  },
});

export const { login, logout, updateAddress } = authSlice.actions;

export default authSlice.reducer;
