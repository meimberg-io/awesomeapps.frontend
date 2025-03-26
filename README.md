
# Setup


## see markdown files





## Production Setup

```bash

# user www  

mkdir /srv/www
useradd -d /srv/www -s /bin/bash www
chown www:www /srv/www

# node 

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm


# nextjs

cd /srv/www
su www

git clone https://###token###@github.com/meimberg-io/serviceatlas.frontend/ /srv/www/serviceatlas

cd /srv/www/serviceatlas

npm install
npm run build

pm2 start npm --name "serviceatlas" -- start
pm2 save
pm2 startup



```


## Deploy

```bash
 git pull && rm -rf .next && npm run build && pm2 restart serviceatlas


```






