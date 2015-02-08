# BRIL-webapp
prototype web application for BRIL monitoring

- for Oracle bindings, see https://www.npmjs.com/package/db-oracle

- install node and npm via your system package manager

- install Node dependencies with:
> npm install

## Prototyping a view:
1) edit **app/index.html**, look for the sections labelled '**TEMPLATE**', and follow the instructions there

2) Choose a name for your view. You'll need to use this string in several places in the code. Let's call it **my_view** in the code, and **My View** in the site-navigation menus/buttons.

3) Copy **app/js/demo_template.js** to **app/js/my\_view.js**
3.1) Edit your new file and do the following:
   ** change 'my_view' to the name of your view everywhere
   ** go to http://www.highcharts.com/demo, pick a plot you like, click on 'edit in jsfiddle', and copy the code from there.
   ** paste that code over the chart object below (between '// TEMPLATE CHART' comments)
   ** in 'successGet', 
