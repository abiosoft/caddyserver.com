---
title: Running ownCloud with Caddy
author: Mathias Beke
date: 2016-03-16 12:00:00
---

*Editor's note: This is a guest post by [Mathias Beke](https://denbeke.be/blog/). We welcome [contributions](https://github.com/caddyserver/caddyserver.com/pulls) to the Caddy blog for any original content relevant to Caddy and the modern Web!*

In this post, I'll walk you through how to set up ownCloud with Caddy for a secure, personal cloud service.

ownCloud
--------

A quick introduction to [ownCloud](https://owncloud.org) for those who never heard about it (as found on Wikipedia):

> OwnCloud (stylized ownCloud) is a suite of client-server software for creating file hosting services and using them.
> OwnCloud is functionally very similar to the widely used Dropbox, with the primary functional difference being that OwnCloud is free and open-source, and thereby allowing anyone to install and operate it without charge on a private server, with no limits on storage space (except for disk capacity or account quota) or the number of connected clients.


Installing MariaDB
------------------

ownCloud requires a database server, so we'll start by installing MariaDB.  
The following command will install MariaDB server and client:

    $ sudo apt-get install mariadb-server

Once you have MariaDB installed you need to secure your installation. This will guide you through some steps.

    $ sudo /usr/bin/mysql_secure_installation


Creating the ownCloud user and database
---------------------------------------

Now you need to login to the MySQL command line with the root credentials.  
Use the following command, and type your root password.

    $ mysql -u root -p

Once logged in we create a new database for ownCloud:

    MariaDB [(none)]> create database owncloud;

and a new user:

    MariaDB [(none)]> grant usage on *.* to owncloud@localhost identified by 'somepassword';

and give that user access to the newly created database:

    MariaDB [(none)]> grant all privileges on owncloud.* to owncloud@localhost;

Now you have a user `owncloud` with password `somepassword` which has access to the database called `owncloud`.


Installing PHP-FPM
------------------

Since PHP 7 was released a couple of months ago, there is no reason not to install this newer version.

First we need to add the repository which contains PHP 7:

    $ sudo add-apt-repository ppa:ondrej/php-7.0
    $ sudo apt-get update

Now we can install PHP:

    $ sudo apt-get install php7.0-fpm

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

    $ sudo apt-get install php7.0-mysql php7.0-gd php7.0-curl php7.0-intl php7.0-mcrypt 

If you need previews for videos and documents you also need to install the following (non-PHP) packages:

- ffmpeg or avconv
- LibreOffice

*Don't forget to restart PHP-FPM: `sudo service php7.0-fpm restart` after installing all extensions.*

Caddyfile
---------

I made the following Caddyfile together with *mholt* and *dprandzioch*. The config contains everything you need for hosting ownCloud server and also supports the desktop and mobile clients.

    my-owncloud-site.com {
    
        root owncloud
        log owncloud/access.log
        errors owncloud/access.log
    
        fastcgi / 127.0.0.1:9000 php {
                env PATH /bin
        }
    
        rewrite {
            r ^/index.php/.*$
            to /index.php?{query}
        }
    
        # client support (e.g. os x calendar / contacts)
        redir /.well-known/carddav /remote.php/carddav 301
        redir /.well-known/caldav /remote.php/caldav 301
    
        # remove trailing / as it causes errors with php-fpm
        rewrite {
            r ^/remote.php/(webdav|caldav|carddav)(\/?)$
            to /remote.php/{1}
        }
    
        rewrite {
            r ^/remote.php/(webdav|caldav|carddav)/(.+)(\/?)$
            to /remote.php/{1}/{2}
        }
    
        # .htacces / data / config / ... shouldn't be accessible from outside
        rewrite {
            r  ^/(?:\.htaccess|data|config|db_structure\.xml|README)
            status 403
        }
        
    }

Thanks to Caddy's [Let's Encrypt](https://letsencrypt.org) integration, our ownCloud installation is automatically secured and served over HTTPS. Access and error logs are written to the ownCloud folder, and the data folder (together with other special files) is protected against requests from the outside.

If you want to test your Caddyfile / PHP installation, you can create a `phpinfo.php` file in the `owncloud` directory, and put the following line into it:

    <?php phpinfo(); ?>

Then navigate to `https://my-owncloud-site.com/phpinfo.php` with your browser and check if the default PHP info page is displayed. (of course after Caddy is running with your Caddyfile)   
*Don't forget to delete this file after everything is working! Other people don't need to know your exact PHP installation with limits and extensions.*


Installing & Configuring ownCloud
---------------------------------

Now it's finally time to install ownCloud.

Download the latest ownCloud version (at the time of writing `9.0.0` was the latest version, check this for yourself):

    $ wget https://download.owncloud.org/community/owncloud-9.0.0.zip

Unzip the files into the `owncloud` directory:

    $ unzip owncloud-9.0.0.zip

Go to `https://my-owncloud-site.com` with your web browser.
If everything works fine, you will see the ownCloud configuration screen.

However, you need to create a `data` folder for ownCloud and give ownCloud (i.e. `www-data` user) write/read access to it.

    $ mkdir owncloud/data
    $ sudo chown -R www-data owncloud


Concluding
----------

Caddy's rapid development makes it a choice candidate for serving your OwnCloud installation securely and easily.

This blogpost is cross-posted on my personal blog, where you can leave comments if you have any questions: [Serving ownCloud with Caddy](https://denbeke.be/blog/webdevelopment/serving-owncloud-with-caddy/)

