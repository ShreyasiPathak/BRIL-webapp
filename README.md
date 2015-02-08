# BRIL-webapp
prototype web application for BRIL monitoring

- for Oracle bindings, see https://www.npmjs.com/package/db-oracle

- install node and npm via your system package manager

- install Node dependencies with:
> npm install

## Prototyping a view:
1) Choose a name for your view. You'll need to use this string in several places in the code. Let's call it **my_view** in the code, and **My View** in the site-navigation menus/buttons.

2) Edit **app/index.html**, look for the sections labelled '**TEMPLATE**', and follow the instructions there. There are several sections that need copying and editing.

3) Copy **app/js/demo\_template.js** to **app/js/my\_view.js**. Edit your new file and change **'my_view'** to the name of your view everywhere.

At this point you should have a basic working app. The **demo_template.js** file you copied does contact the server for data, but it only fetches a fixed array of test data that happens to match this plot well. This lets you get a working plot first, before fussing with the server.

4) go to **http://www.highcharts.com/demo**, pick a plot you like, click on 'edit in jsfiddle', and copy the code from there. Paste that code over the chart object below (between '// TEMPLATE CHART' comments)

5) in 'successGet', you will need to pull the useful bits out of your data and feed them to the plot. You'll have to look at the chart structure for how to do that, they all differ slightly but it should be obvious where it goes.