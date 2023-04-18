# snapfu web portal
This is the Web portal or frontend project of the snapfu solution. This is run together with the [snapfu-web-api](https://github.com/litemikx/snapfu-web-api). The snapfu web allows you to manage the connection and the automated backup jobs (snaps) via web. It interacts directly to the API service. 

## Installation
1. Clone the project. 
```
git clone https://github.com/litemikx/snapfu-web-portal.git
```
2. Update the .env.template file and rename it to .env. 
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
5. To build the app in production, you can run command below:
```
npm run build
```
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

To see a demo or how this works, you can check my blog post tutorial here: [How to Use: snapfu](https://thisdevblogs.wordpress.com/2023/04/18/snapfu-a-mirth-connect-autobackup-system/)

If you like this or want to support my side projects, like this one, you can:

<a href="https://www.buymeacoffee.com/heymikko" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important"></a>

