# BRIL-webapp
## prototype web application for BRIL monitoring

## Installation/setup
This part tells you how to get a copy of the code so you can run it, but if you want to develop new code you should read the **Developing with GIT** section (below) first.

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

(you can clone a private fork instead of my personal repository if you want to develop code see below for details)

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

3) Copy **app/js/demo\_template.js** to **app/js/my\_view.js** (using the correct name instead of **my\_view**, of course). Edit your new file and change **'my_view'** to the name of your view everywhere. Again, there are a few places scattered through the file, check them all.

At this point you should have a basic working app. The **demo_template.js** file you copied does contact the server for data, but it only fetches a fixed array of test data that happens to match this plot well. This lets you get a working plot first, before fussing with the server.

4) You can test your app by restarting your server from the command-line:
> node server/server.js

then go to **http://localhost:9234/** in your browser and you should see the interface. If all went well, there is a button there for your view, and when you click on it you should get a graph of average temperatures in Tokyo throughout the year.

5) So far, so good. Now go to **http://www.highcharts.com/demo**, pick a plot you like, click on '**edit in jsfiddle**', and copy the JavaScript code from there. Paste that code over the chart object in your JavaScript file (between '// TEMPLATE CHART' comments).

Getting the right part of the code can be a bit tricky. You don't want the whole function, you want the only the arguments inside the call to **$('#container').highcharts()**. Take a look in the **app/js/demo_template.js** file and compare it to the source code for the [basic line graph](http://jsfiddle.net/gh/get/jquery/1.9.1/highslide-software/highcharts.com/tree/master/samples/highcharts/demo/line-basic/) and you'll get the idea. 

Even then, some of the more advanced demos (e.g. the complex heatmap) will take a lot more work. Ask me for help if you get stuck.

Reload your browser window and look at your view, it should reproduce the demo correctly.

6) Now make a fake data-source. Copy **demo/handle\_demo\_template.js** to **demo/handle\_my\_view.js** (substituting the correct string for **'my\_view'**), edit it, and follow the instructions in the comments. In particular, the **getFakeData** function needs to be updated. It should return a structure that looks exactly like your data from xmas.

7) restart your server (see step 4). You can now visit **http://localhost:9234/get/my\_view/data** (again, put correct name instead of **my_view**) and you should see a JSON structure that looks like your fake data.

8) If that works, go back to your **app/js/my\_view.js** file again. In '**successGet**' you will need to pull the useful bits out of your data and feed them to the plot, and change options like titles, axes etc. You'll have to look at the chart structure for how to do that, they all differ slightly but it should be reasonably obvious where it all goes.

9) At this point you should have your chart looking how you want it, so now it's time to connect to a real data-source. Go back to **demo/handle\_my\_view.js** and set the **hostname**, **port**, and **path** in the **options** object. In the top-level directory, edit the **config.json** file and set **fakedata** to **false**. Then re-start the server. If you've done a good job of making your fake data look like your real data (step 6) then everything will just work out of the box.

Of course, you'll need to be inside the **.cms** firewall to contact the real data sources. That's partly why we develop with fake data, it allows you to write code at home on a laptop with a friendly environment etc, rather than code and run over a link with all the fun and games that gives.

For a working example of all that, take a look at the 'bcml' chart. The code is in **app/js/demo\_bcml.js** and **demo/handle\_bcml.js**. It contacts xmas and pulls out the **PercentAbort1** values, then plots them as a line graph. Not very exciting, but it does do all the steps correctly, so that should help.

# Developing with GIT
## Getting started
Any decent git tutorial should serve you well. The basic workflow is:

1) Create an account at github.com.
2) Import your SSH key so you can upload files easily: on your github home-page go to 'Settings' -> 'SSH Keys', follow the instructions. Since you probably already have an SSH key you can just import that, no need to create a new one.
3) 'fork' this repository: Go to http:github.com/TonyWildish/BRIL-webapp and click the 'fork' button, follow the instructions
4) Now 'clone' your forked repository to your development machine:
> git clone git@github.com:YourUserName/BRIL-webapp

Congratulations, you now have a working copy of the code to play with!

## Adding your own code
Now you can create new files and add them to your fork. Create new files following the instructions for **prototyping a view**, above. Then:

> git add file1 file2 file3 ...
> git commit -m "add a meaningful commit message here"
> git push

Your fork now contains new code that is not in my version of the repository. You can 'rm -rf' your working directory and still recover it by cloning your fork again. So you have version control and your code is safe. You can git add/commit/push as often as you like, there's no harm in committing early and often.

When you're happy with your code and want to merge it with my repository, go to github.com, select your repository, and click on the **pull request** button. Give a title and useful comment to your request, then click the **create pull request** button. This tells me that your code is ready and I should do the merge, and I take it from there.

## Multiple developers
There are more things to worry about when there are many developers actively working.

For one thing, your fork can become out of date with respect to the main code if others are updating it while you're developing in your corner. If that happens it will show up when you create a pull request, you will see many changes that happened in the main branch but not in yours. No problem, we can tackle that on a case-by-case basis when it arises, it's best to get some experience with GIT before trying to learn how to deal with that.

Otherwise, the usual basic hygiene of making sure that no two people are working on the same set of files is a good idea. You can certainly do that, but even with a proper VCS like GIT it's possible to mess up, overwriting changes without realising it. If there are two of you working on the same view then you may have that problem, otherwise it shouldn't arise in this project. Only if you're making changes to the HTML template, or to the server core, is that likely to happen.