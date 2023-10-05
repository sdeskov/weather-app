# Description
This is a simple weather application that on initial load shows the forecast for today and the next 4 days.
When a day is selected, the user is taken to a page where they can see the forecast for this day in 3-hour steps.

The application uses the free version of OpenWeather API (https://openweathermap.org/api).

## Known issues and workarounds
Due to limitations of the free version, only the https://openweathermap.org/forecast5 endpoint is used, which returns a 5-day forecast in 3-hour steps.
This leads to several issues:
1. There isn't a single average temperature for the day (including min and max temps - those are available for each 3-hour step, not for the whole day). In order for the app to display a single day temperature, an average of all 3-hour temperatures provided for this day (at the time of fetching the results, so the number of temperatures can vary) has been calculated.
2. Weather alerts are not available
3. Since the call to this endpoint always returns 80 timestamps (5 days x 8 3-hour steps), sometimes a sixth day is shown to the user, depending on what time of day the app is ran. I have decided to leave that as is, since it felt more natural - if it's nearing the end of the first day, a user might want to be able to see a bit further in time.
4. Descriptions and icons in most cases are different for each 3-hour step and as such that proves to be a design challenge when deciding how to display an "average" description/icon for the daily forecast. A rotating approach was tested where all descriptions and icons were being changed every 2 seconds to display them all, but that had its difficulties and didn't feel very informative. Therefore, this was solved by displaying the most common weather icon and description.

## API key!
The key is part of React's environmental variables for security reasons, which in turn are part of the .gitignore file.
In order to access the weather information, you'd have to insert your OpenWeather API key in the .env file in the root of the project
Example: REACT_APP_OPENWEATHER_KEY={API_KEY}


## Installing and running the project

In order to install all dependencies, in the project directory, you need to run:

### `npm/yarn install`

In the project directory, you can run:

### `npm/yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
