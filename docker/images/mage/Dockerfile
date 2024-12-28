ARG NODE_VERSION=20
FROM mageio/base:${NODE_VERSION}

ARG mage_VERSION
RUN if [ -z "$mage_VERSION" ] ; then echo "The mage_VERSION argument is missing!" ; exit 1; fi

LABEL org.opencontainers.image.title="mage"
LABEL org.opencontainers.image.description="Workflow Automation Tool"
LABEL org.opencontainers.image.source="https://github.com/mage-io/mage"
LABEL org.opencontainers.image.url="https://mage.io"
LABEL org.opencontainers.image.version=${mage_VERSION}

ENV mage_VERSION=${mage_VERSION}
ENV NODE_ENV=production
ENV mage_RELEASE_TYPE=stable
RUN set -eux; \
	npm install -g --omit=dev mage@${mage_VERSION} --ignore-scripts && \
	npm rebuild --prefix=/usr/local/lib/node_modules/mage sqlite3 && \
	rm -rf /usr/local/lib/node_modules/mage/node_modules/@mage/chat && \
	rm -rf /usr/local/lib/node_modules/mage/node_modules/mage-design-system && \
	rm -rf /usr/local/lib/node_modules/mage/node_modules/mage-editor-ui/node_modules && \
	find /usr/local/lib/node_modules/mage -type f -name "*.ts" -o -name "*.js.map" -o -name "*.vue" | xargs rm -f && \
	rm -rf /root/.npm

# Setup the Task Runner Launcher
ARG TARGETPLATFORM
ARG LAUNCHER_VERSION=1.1.0
COPY mage-task-runners.json /etc/mage-task-runners.json
# Download, verify, then extract the launcher binary
RUN \
	if [[ "$TARGETPLATFORM" = "linux/amd64" ]]; then export ARCH_NAME="amd64"; \
	elif [[ "$TARGETPLATFORM" = "linux/arm64" ]]; then export ARCH_NAME="arm64"; fi; \
	mkdir /launcher-temp && \
	cd /launcher-temp && \
	wget https://github.com/mage-io/task-runner-launcher/releases/download/${LAUNCHER_VERSION}/task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz && \
	wget https://github.com/mage-io/task-runner-launcher/releases/download/${LAUNCHER_VERSION}/task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz.sha256 && \
	# The .sha256 does not contain the filename --> Form the correct checksum file
	echo "$(cat task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz.sha256) task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz" > checksum.sha256 && \
	sha256sum -c checksum.sha256 && \
	tar xvf task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz --directory=/usr/local/bin && \
	cd - && \
	rm -r /launcher-temp

COPY docker-entrypoint.sh /

RUN \
	mkdir .mage && \
	chown node:node .mage
ENV SHELL /bin/sh
USER node
ENTRYPOINT ["tini", "--", "/docker-entrypoint.sh"]
