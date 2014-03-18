## StartupMap.cz
Czech startups visualized on map.

### System dependencies
Make sure you have installed [Pow](http://pow.cx/) in your system if you want to test project on your local computer.

### Configuration & Setup
```
# clone repository
mkdir ~/Sites/startupmap
git clone git@github.com:romansklenar/startupmap.cz.git ~/Sites/startupmap

# link project folder to Pow
cd ~/.pow
ln -s ~/Sites/startupmap

# open project in browser
open startupmap.dev
```

### Services
We use [StartupJobs.cz](http://startupjobs.cz/map.php) API as data source to retreive list of startups.
