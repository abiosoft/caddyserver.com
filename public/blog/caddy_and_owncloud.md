    ---
    title: Running ownCloud with Caddy
    author: Mathias Beke
    date: 2015-09-15 12:00:00
    ---

Running ownCloud with Caddy
===========================

ownCloud
--------

A quick introduction to [ownCloud](https://owncloud.org) for those who never heard about it (as found on Wikipedia).

> OwnCloud (stylized ownCloud) is a suite of client-server software for creating file hosting services and using them.
> OwnCloud is functionally very similar to the widely used Dropbox, with the primary functional difference being that OwnCloud is free and open-source, and thereby allowing anyone to install and operate it without charge on a private server, with no limits on storage space (except for disk capacity or account quota) or the number of connected clients.


Installing MariaDB
------------------

OwnCloud requires MySQL (or in this case) MariaDB.  
The following command will install MariaDB server and client, and will ask you for a root password.

    $ sudo apt-get install mariadb-server

Once you have MariaDB installed you need to secure your installation. This will guide you through some steps.

    $ sudo /usr/bin/mysql_secure_installation


Creating the ownCloud user and database
---------------------------------------

Now you need to login to the MySQL command line with the root credentials.  
Use the following command, and type your root password.

    $ mysql -u root -p

Now we create a new database for ownCloud:

    MariaDB [(none)]> create database owncloud;

and a new user:

    MariaDB [(none)]> grant usage on *.* to owncloud@localhost identified by 'somepassword';

and give that user access to the newly created database:

    MariaDB [(none)]> grant all privileges on owncloud.* to owncloud@localhost;

Now you have a user `owncloud` with password `somepassword` which has access to the database called `owncloud`.


Installing PHP-FPM
------------------

Note: install PHP >= 5.6, ownCloud doesn't play well with PHP-FPM 5.5.9.

You also need to install PHP-FPM before you can actually install ownCloud.

    $ sudo apt-get install php5-fpm

Simply installing PHP isn't enough, in order to have ownCloud working properly, you also need some extra PHP extensions.
A list of all ownCloud requirements can be found [here](https://doc.owncloud.org/server/7.0/admin_manual/installation/source_installation.html).
The extensions below are recommended for ownCloud and not included in the default PHP installation:

- PHP mysql driver
- PHP gd
- PHP curl
- PHP intl
- PHP mcrypt
- PHP imagick

You can install them all at once:

    $ sudo apt-get install php5-mysql php5-gd php5-curl php5-intl php5-mcrypt php5-imagick

If you need previews for videos and documents you also need to install the following (non-PHP) packages:

- ffmpeg or avconv
- LibreOffice


To secure your PHP-FPM installation you better disable path fixing.  
Add the line `fix.pathinfo=0` to the `/etc/php5/fpm/php.ini` file.

Caddyfile
---------

The following Caddyfile should work with ownCloud.

    http://my-owncloud-site.com {
        redir https://my-owncloud-site.com
    }
    
    https://my-owncloud-site.com {
        root owncloud
        tls server.crt server.key
        log access.log
    
        # PHP-FPM with Unix socket
        fastcgi / /var/run/php5-fpm.sock php
        
        # TODO: add routes
    }

Feel free to check my personal blog if you need help [generating a self-signed certificate](https://denbeke.be/blog/servers/creating-a-self-signed-ssl-certificate-on-linux/).

If you want to test your Caddyfile / PHP installation, you can create a `phpinfo.php` file in the `owncloud` directory, and put the following line into it:

    <?php phpinfo(); ?>

Navigate then to `https://my-owncloud-site.com/phpinfo.php` with your browser and check if the default PHP info page is displayed. (of course after Caddy is running with your Caddyfile)   
*Don't forget to delete this file after everything is working!*


Installing & Configuring ownCloud
---------------------------------

Now it's finally time to install ownCloud.

Download the latest ownCloud version (at the time of writing `8.1.1` was the latest version, check this for yourself if you are following my tutorial):

    $ wget https://download.owncloud.org/community/owncloud-8.1.1.zip

Unzip the files into the `owncloud` directory:

    $ unzip owncloud-8.1.1.zip

Go to `https://my-owncloud-site.com` with your webbrowser (of course after Caddy is running with your Caddyfile).

If everything works fine, you will see the ownCloud configuration screen.

However, you need to create a `data` folder for ownCloud and give ownCloud (i.e. `www-data` user) write/read access to it.

    $ mkdir owncloud/data
    $ chgrp www-data owncloud/data/
    $ chmod 770 owncloud/data/

