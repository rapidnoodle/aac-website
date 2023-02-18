# The Army Air Corps' Official Website

The Army Air Corps is the aviation branch of the British Army, and AAC soldiers deliver firepower from battlefield helicopters and fixed-wing aircraft to overwhelm and defeat enemy forces. The Army Air Corp also provides aerial reconnaissance while being deployed, so that the enemy forces can be identified and dealt with before they become a threat. This fearsome combination of manoeuvrability and firepower makes the AAC one of the most potent of the Army’s combat arms. It's about time somebody created a website for one of ReaperAaron's greatest regiments.

### Setup

Clone the project using GitHub Desktop or the Git CLI or any other way, it doesn't matter.

Open the project in your desired code editor.

Launch a new terminal or command prompt depending on your device and install the required Node Modules for this project in the root project directory:

```
$ npm i
```

Create a .env file in the root project directory and set these variables (you don't have to use these specific values):

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/database
```

Open up another, separate terminal in your home directory (NOT PROJECT ROOT) and run the following command (make sure you have Mongo completely installed before you run this command):

```
$ mongod
```

Launch MongoDBCompass and connect to your local database. Pretty much 100% of the time you just have to click "connect" because it has all of the default values set for you.

Inside the original terminal in the root project directory, run the project with either node (run start) or nodemon (run dev).

```
$ npm run start
$ npm run dev
```
