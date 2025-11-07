# Vision: App Backend

## Preliminary note

In both the frontend and the strapi project the main entity is a "app" which means an app. Both m,ean the same. I will rename the "app" to "app" but not for the moment. In this feature we will be talking abut apps, which means the same as services

## Vision

I want to create a Backendsection for editing apps and an apps import/update queue. The backend shell be available only to a special list of users. It can be reched fron a navigation point in The user menu.

## Navigation

The Backend has its own subnavigation:

* Dashboard (default)
* Apps
* App Queue
* Tags
* Users

## Dashboard

The dashboard shows only some stats (number of services, number of users) nest services, ...?

## Apps

This section shows a list of apps with editing options.

### List

* List os all apps
* sorting: choosable (default is ba name). Options TBD
* Field selection, which fields are shown, possible. Fields (columns) are movablwe per drag'n'drop
* each app ist editabble and deletable (delete confirmation needed). Edit opens an edit mask.
* Filter posibilities. TBD

### Edit Mask

* The edit Mask allows to edit all fields ob a app. Fieldtypes and selection or design of appropiate input controls needed
* Translation de / en has to be taken into account (en is default language, de should always be present)
* logo upload should be possible
* check of uniqueness of particular fields (name, slug, url) needed

### App queue

A Mask for quickly see and edit the "new app" list. 

### Tags

* List of tags: Name, icon, Number of connected Services
* View Insert, edit, delete.
* Sorting by name

### Users

* List of Users, Name, Mail, Last Login (if determinable)



