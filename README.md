# BRIL-webapp
prototype web application for BRIL monitoring

- for Oracle bindings, see https://www.npmjs.com/package/db-oracle

- install node and npm via your system package manager

- install Node dependencies with:
> npm install

## Prototyping a view:
1) Choose a name for your view. You'll need to use this string in several places in the code. Let's call it **my\_view** in the code, and **My View** in the site-navigation menus/buttons. It's important that **my\_view** be used consistently in both the HTML and JavaScript code, or the code will fail silently.

2) Edit **app/index.html**, look for the sections labelled '**TEMPLATE**', and follow the instructions there. There are several sections that need copying and editing.

3) Copy **app/js/demo\_template.js** to **app/js/my\_view.js** (using the correct name instead of **my\_view**, of course). Edit your new file and change **'my_view'** to the name of your view everywhere.

At this point you should have a basic working app. The **demo_template.js** file you copied does contact the server for data, but it only fetches a fixed array of test data that happens to match this plot well. This lets you get a working plot first, before fussing with the server.

4) You can test your app by running **node server/server.js** from the command-line, then go to **http://localhost:9234/** in your browser and you should see the interface. If all went well, there is a button there for your view, and when you click on it you should get a graph of average temperatures in Tokyo throughout the year.

5) So far, so good. Now go to **http://www.highcharts.com/demo**, pick a plot you like, click on '**edit in jsfiddle**', and copy the code from there. Paste that code over the chart object in your JavaScript file (between '// TEMPLATE CHART' comments).

Reload your browser window and look at your view, it should reproduce the demo correctly.

6) Now make a fake data-source. Copy **demo/handle\_demo\_template.js** to **demo/handle\_my\_view.js** (substituting the correct string for **'my\_view'**), edit it, and follow the instructions.

7) restart your server (see step 4). You can now visit **http://localhost:9234/get/my\_view/data** (again, put correct name instead of **my_view**) and you should see a JSON structure that looks like your fake data.

8) If that works, go back to your **app/js/my\_view.js** file again. In '**successGet**' you will need to pull the useful bits out of your data and feed them to the plot, and change options like titles, axes etc. You'll have to look at the chart structure for how to do that, they all differ slightly but it should be obvious where it goes.

9) Connect to a real data-source. Not sure how to do that yet...