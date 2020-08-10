FROM adoptopenjdk:11-jre-hotspot-bionic

RUN apt-get update \
    && apt-get -y install --no-install-recommends apt-utils dialog 2>&1 \ 
    && apt-get -y install git iproute2 procps vim less wget \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
  && apt-get install -y nodejs \
  && curl -L https://www.npmjs.com/install.sh | sh

RUN wget -O ~/posh-git.sh "https://raw.githubusercontent.com/lyze/posh-git-sh/master/git-prompt.sh" \
    && echo "source ~/posh-git.sh" >> ~/.bashrc \
    && echo "PROMPT_COMMAND='__posh_git_ps1 \"\[\e[0;33m\]\w \" \"\[\e[1;34m\]\n\\\$\[\e[0m\] \";'\$PROMPT_COMMAND" >> ~/.bashrc

WORKDIR /workspace
COPY . .
RUN npm install

RUN npm install -g firebase-tools

ENV DEBIAN_FRONTEND=dialog
