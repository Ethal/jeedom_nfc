#!/bin/bash

dir=$1
url=$2

touch /tmp/nfc_dep

echo "Début installation"
echo "0" > /tmp/nfc_dep
cd ${1}
cd nfc-eventd

# Apt dependencies
sudo apt-get -y install zlib1g-dev gcc make git autoconf autogen automake pkg-config
echo "20" > /tmp/nfc_dep

cd nfc-eventd
echo "60" > /tmp/nfc_dep

# build it
autoreconf -vis
./configure
make
sudo make install

echo "90" > /tmp/nfc_dep

#config nfc-eventd
cp $dir/nfc-eventd.conf /usr/local/etc/nfc-eventd.conf

    escaped="$2"

    # escape all backslashes first
    escaped="${escaped//\\/\\\\}"

    # escape slashes
    escaped="${escaped//\//\\/}"

    # escape asterisks
    escaped="${escaped//\*/\\*}"

    # escape full stops
    escaped="${escaped//./\\.}"

    # escape [ and ]
    escaped="${escaped//\[/\\[}"
    escaped="${escaped//\[/\\]}"

    # escape ^ and $
    escaped="${escaped//^/\\^}"
    escaped="${escaped//\$/\\\$}"

    # remove newlines
    escaped="${escaped//[$'\n']/}"

sed -i -e 's/#URL#/'${escaped}'/g' /usr/local/etc/nfc-eventd.conf

escaped="$1"

    # escape all backslashes first
    escaped="${escaped//\\/\\\\}"

    # escape slashes
    escaped="${escaped//\//\\/}"

    # escape asterisks
    escaped="${escaped//\*/\\*}"

    # escape full stops
    escaped="${escaped//./\\.}"

    # escape [ and ]
    escaped="${escaped//\[/\\[}"
    escaped="${escaped//\[/\\]}"

    # escape ^ and $
    escaped="${escaped//^/\\^}"
    escaped="${escaped//\$/\\\$}"

    # remove newlines
    escaped="${escaped//[$'\n']/}"

sed -i -e 's/#DIR#/'${escaped}'/g' /usr/local/etc/nfc-eventd.conf

echo "Fin installation"
rm /tmp/nfc_dep
