# mage - Custom Image

Dockerfile which allows to package up the local mage code into
a docker image.

## Usage

Execute the following in the mage root folder:

```bash
docker build -t mage-custom -f docker/images/mage-custom/Dockerfile .
```
