import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {axiosPublic} from '../axios';


export const logoutAuthUser = createAsyncThunk('auth/logoutUser', async (args, {getState}) => {

    const {auth: {user}} = getState();
    // const dispatch = useDispatch();
    try {
        
        localStorage.clear();
        await axiosPublic.post('/api/auth/logout', JSON.stringify({id: user?.id || null, role: user.role}));
        // logout success
        return {};
    } catch (err) {
        return {};
    }
})


const initState = {
    accessToken: null,
    user: null, // {roles: [], id: _id}
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initState,
    reducers: {
        loginSuccess: (state, action) => {
            // we are going to get the access token and user data through payload
            return {...state, accessToken: action.payload.accessToken, user: action.payload.user};
        },
        logoutSuccess: (state) => {
            return {...state, accessToken: null, user: null};
        }
    },
    extraReducers(builder) {
        builder.addCase(logoutAuthUser.fulfilled, (state, action) => {
            state.accessToken = null;
            state.user = null;
        })
    }
});

export const selectAccessToken = state => state.auth.accessToken;
export const selectAuthUser = state => state.auth.user;

export const {loginSuccess, logoutSuccess} = authSlice.actions;

export default authSlice.reducer;