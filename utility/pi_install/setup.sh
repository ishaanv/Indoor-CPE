# update for dependencies and security
sudo apt-get update -y
sudo apt full-upgrade -y

# python dependencies
sudo apt-get -y install python-pip
sudo pip install pyserial

# Install Node Version Manager (NVM)
curl -0- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash

# rerun Profile scrip to start NVM
source ~./bashrc

# install ARM version of Node.js via NVM
nvm install 8
# 8 is the current stable version, potentially upgrade to 10 later
nvm use 8

# update NPM
npm install npm@latest -g
