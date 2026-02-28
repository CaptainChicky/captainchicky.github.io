## Finished Projects

The projects are folders from the root directory.

- `/plant-generator/` - This has a js animation template I found from a robux generator scam site. I've basically implemented/refactored this animation, and included the "OnlyPlants" logo. Then there's a captcha implementation and redirection based on choices. Images served are from gelbooru and modified to look grotesque, and the image downloading page has some js fuckery to it :P.
- `/The-Aviary/` - This is a webdev practice recreation of my first website made in wix, with AJAX go brr.
- `/NFT/` - Implement not just the a random pixels thing, but also a selector thing for different arts, perhaps.

## Unfinished Projects

- `/Idiots!/` - A comprehensive overview and 3 implementations of Trojan.JS.YouAreAnIdiot. polish
- `/Captcha-test/` - I need to actually properly implement the animation and popups lol.
- `/Clouds/` - I need to restructure the site and make it more practical. Then, I can do the writeup.
- `/Space/` - Structure this properly lmao and make writeups.
- `/Zip-Bomb/` - I need to actually relearn everything and finish this. This will take a while.

# To-Do & Things to Note

2. "sakura.myacgcat.top" dir in Archive somehow messes the build up if it include it in sparse-checkout. This is maybe due to the chinese chars?
   Figure out what causes this and fix it before I attempt to build and host the page's mirror.
3. The front page is actually bad lmao. Perhaps fix it and like unironically.
4. <details>
   <summary>Sparse-checkout exclusion content as of 7/17/2023</summary>
   <!--- Here are the major directories -->
   admin/*<br>
   Archive/ (well, most of it lmao, so no asterisk)<br>
   Art/*<br>
   School/*<br>
   <!--- Here are specific dirs/files within projects -->
   Idiot!/index_files/fp_32.0.0.371_archive/Source/*<br>
   </details>
5. Make the LaTeX papers I've written availible in a dir here. Latex to html?
5. Copy over my aops blog lol
7. Restructure .svg files and remove local .dtd's, such as the one in `/Space/`.

# How the Custum Workflow Works

The workflow is triggered by a push to the master branch.

In the GitHub repo settings, under "Pages", I've set the compile source to GitHub Actions, which disables the default compiler and instead compiles with a custum action that I've defined in the `/.github/workflows/` dir. The action is defined in the `build.yml` file within that dir.

The compilation is done within a runner virtual machine running on an OS specified within the yaml (in my case, this is the latest version of Ububtu Linux). Within the yaml, everything up to the jobs is pretty straightforward and explained by the inner comments. The job consists of two parts, which are the build and deployment jobs.

The build job has a few steps. Each step uses a github action contained within *https://github.com/actions/[action]@[version]*. You just have to type the latter part ([action]@[version]) for GitHub to understand which action you want to use. Now, **this is the important part**.

The first step is the _Checkout_ step. This first git clones the repo into the runner vm. However, since my entire repo is far too large, the runner runs out of memory and the build fails on default settings. To remedy this, we simply use _sparse-checkout_, with _cone mode_ on false. More information on cone mode in the comments in the yaml. With cone mode off, we only have to include line by line the directories/files we need (note that this _must_ include utility files, such as config yamls, and the Gemfile), which directories to exclude, and it will not grab anything else, except the most shallow layer of directories immediately within the root dir (the files immediately within the first directory that is beyond the root dir).

Then, it sets up ruby in _Setup Ruby_, downloading specifically _v1.146.0_. I may need to update this in the future, such as changing the version, if my site every fails to compile because of an old and depreciated ruby version, but tis still years to come so whatever. Next, it sets up pages in _Configure Pages_, and runs a command on the runner vm terminal to build the website using Jekyll. The build here obeys the checked out file `_config.yml`, which I've specified to ignore all files with a "\_" in front of them. This is precisely why we also needed to checkout the Gemfile, as the Gemfile specifies to ruby to download the latest version of Jekyll. Then, it uploads the compiled artifacts in _Upload artifact_ to the GitHub server. This step usually takes the longest.

The second part of the job is the deployment job, which simply sets up _github-pages_, and uses the action _Deploy to Github Pages_ to deploy the compiled artifacts to the GitHub Pages server. This is the server that hosts the website, and when the job is done, the updated webpage can be succesfully accessed on the web.

Hopefully this overview is comprehensive enough for future me to debug if I ever need to. I hope I don't. Also, large binaries should be avoided in the build, as they will hog unneccesary resources, but can be included in the repo. Regardless, if I ever manage to get a server running even though it's gonna cost a shitton of money (which is why I _don't_ have a server running rn lmao), I can include these binaries within the website and re-edit the pages as needed, but I'd also need to refigure out how to deploy the page, so bruh whatever 🥲.