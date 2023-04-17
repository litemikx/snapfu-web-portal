# snapfu Web Portal
This is the Web portal or frontend project of the snapfu solution. This is run together with the [snapfu-web-api](https://github.com/litemikx/snapfu-web-api). The snapfu web allows you to manage the connection and the automated backup jobs (snaps) via web. It interacts directly to the API service. 

### Installation
1. Clone the project. 
```
git clone https://github.com/litemikx/snapfu-web-portal.git
```
2. Update the .env.template file.
```
REACT_APP_API_URL=YOUR_SNAPFU_API_URL
```
3. Run in the terminal:
```
npm install
```
4. Start the app by running:
```
npm start
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
