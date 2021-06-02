# Movie Series Search Frontend Challenge

Searches the [OMDB](https://omdbapi.com/) for your supplied search string, then filters the results based on your chosen filter constraints.

The redux state is pre-hydrated with sample data on first load, however the api connection to OMDB is fully functional and can be used to search
for any content. 

Because the OMDB doesn't allow search based on year range, all years are initially sourced and then filtered out in the client. If you search for a popular
term, this may result in dozens of api calls in order to fetch all the content to then filter.

## BEFORE YOU RUN

This project uses the build tool yarn, you can install it by running the command
`npm install --global yarn`

This project utilises the OMDB api which requires a free api key to access. Please insert your key into the .env.example file and rename
the file to .env otherwise you will be unable to connect to the third party data source.

## The following scripts are available to you

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.