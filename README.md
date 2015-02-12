# BRIL-webapp
## prototype web application for BRIL monitoring

## Installation/setup
You can run this code on any unix box with **Node** and **npm** installed, such as your laptop, lxplus, vocms063, or a VM. I personally use a VM running on my MacBook Pro so I can develop locally.

You can read more about **Node** at http://nodejs.org/ and more about **npm** at http://npmjs.org/ if you like, but it's not required.

This package consists of a server, written in Javascript, which runs under **Node.js**. There is also a client, a standard JavaScript application that is packaged with the server. The server runs close to the DAQ, the client is loaded into your browser when you visit the server URL.

First install **Node** and **npm** via your system package manager or following the documentation on the sites listed above. If you're running on **vocms063** or **lxplus** you can verify that Node and npm are already installed there:
> node -v
> npm -v

you should see the version numbers printed out. If you're running on a private VM at CERN you can probably install them with this command:
> sudo yum install -y node npm

Next, clone this package to your working directory:
> git clone https://github.com/TonyWildish/BRIL-webapp.git

That will give you a copy that you can play with, but to commit your changes you'll want to go to that URL on github, **fork** this package to your own account, and clone your fork here instead. Then you can commit your developments to your fork and make a **pull** request for me to update the main repository.

If you're not familiar with git you have two choices: either find a git tutorial (github has one, but there are plenty more out there) or be lazy, and clone as in the example above. When you have working code that you want to have committed back to the repository, mail me with a tgz of the code and I'll import it for you. That's not a sustainable way of working if development is heavy, but it can get you started.

Then 'cd' into the BRIL-webapp directory and install the **Node** packages that this app depends on with:
> npm install

that should only take a minute or two.

## Testing the installation
Start the server by running
> node server/server.js

you should see a few lines of output ending with 'Listening on :(port-number)'. If you don't, either your installation failed or there's a clash on that port (e.g. someone else running this on the same machine). Edit **config.json** in the top-level directory and pick a different port number, then try again.

Once your server is running you can open a browser on the same host and go to http://localhost:9234/ (substitute your port number, of course). You should see the client application in the browser, and the server should log a bunch of impressive-looking output.

If you can't run a browser on the same host, first try with **wget** or **curl**:
> wget -O - http://localhost:9234/

you should see a raw HTML page being dumped on your terminal, and the server should report that it served it to you. If that works, try from a browser on your local machine, and if it can't connect then you have a firewall problem, not a problem with the server.

## Prototyping a view:
Prototyping a view consists of a few steps:
- choosing a name for it
- choosing a chart template
- implementing the chart in the client application
- creating a (fake) data-source for the server to use to send data to the client
- connecting the fake data from the server to your client
- finally, once we figure out how, connect the server to a live data-source

To start with, let's not consider interaction from the browser, as in masking BCM1F channels. Let's make a prototype that simply displays data, and refreshes it when you click the buttons.

1) Choose a name for your view. You'll need to use this string in several places in the code. Let's call it **my\_view** in the code, and **My View** in the site-navigation menus/buttons. It's important that **my\_view** be used consistently in both the HTML and JavaScript code, or the code will fail silently.

2) Edit **app/index.html**, look for the sections labelled '**TEMPLATE**', and follow the instructions there. There may be several sections that need copying and editing.

3) Copy **app/js/demo\_template.js** to **app/js/my\_view.js** (using the correct name instead of **my\_view**, of course). Edit your new file and change **'my_view'** to the name of your view everywhere.

At this point you should have a basic working app. The **demo_template.js** file you copied does contact the server for data, but it only fetches a fixed array of test data that happens to match this plot well. This lets you get a working plot first, before fussing with the server.

4) You can test your app by restarting your server from the command-line:
> node server/server.js

then go to **http://localhost:9234/** in your browser and you should see the interface. If all went well, there is a button there for your view, and when you click on it you should get a graph of average temperatures in Tokyo throughout the year.

5) So far, so good. Now go to **http://www.highcharts.com/demo**, pick a plot you like, click on '**edit in jsfiddle**', and copy the JavaScript code from there. Paste that code over the chart object in your JavaScript file (between '// TEMPLATE CHART' comments).

Getting the right part of the code can be a bit tricky. You don't want the whole function, you want the only the arguments inside the call to **$('#container').highcharts()**. Take a look in the **app/js/demo_template.js** file and compare it to the source code for the [basic line graph](http://jsfiddle.net/gh/get/jquery/1.9.1/highslide-software/highcharts.com/tree/master/samples/highcharts/demo/line-basic/) and you'll get the idea. 

Even then, some of the more advanced demos (e.g. the complex heatmap) will take a lot more work. Ask me for help if you get stuck.

Reload your browser window and look at your view, it should reproduce the demo correctly.

6) Now make a fake data-source. Copy **demo/handle\_demo\_template.js** to **demo/handle\_my\_view.js** (substituting the correct string for **'my\_view'**), edit it, and follow the instructions.

7) restart your server (see step 4). You can now visit **http://localhost:9234/get/my\_view/data** (again, put correct name instead of **my_view**) and you should see a JSON structure that looks like your fake data.

8) If that works, go back to your **app/js/my\_view.js** file again. In '**successGet**' you will need to pull the useful bits out of your data and feed them to the plot, and change options like titles, axes etc. You'll have to look at the chart structure for how to do that, they all differ slightly but it should be obvious where it goes.

9) Connect to a real data-source. Not sure how to do that yet...