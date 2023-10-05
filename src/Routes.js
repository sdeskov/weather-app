import React from 'react';
import {
    createBrowserRouter,
} from "react-router-dom";

import App from './App';
import HourlyWeather from "./Components/HourlyWeather";
import FourZeroFour from "./404/FourZeroFour";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <FourZeroFour />,
    },
    {
        path: "hourly/:date",
        element: <HourlyWeather />
    },
]);