#!/bin/bash

CACHE_PATH="/var/cache/nginx"

echo "Content-Type: text/plain"
echo ""


FILE_HASH=$(echo -n "$FILE" | md5sum | awk '{ print $1 }')
echo "MD5 checksum of $FILE: $FILE_HASH" >&2
FOLDER="${FILE_HASH: -1}"
SUBFOLDER="${FILE_HASH: -3:2}"



if [ -f "$CACHE_PATH/$FOLDER/$SUBFOLDER/$FILE_HASH" ]; then
    rm -f "$CACHE_PATH/$FOLDER/$SUBFOLDER/$FILE_HASH"
    if [ $? -eq 0 ]; then
        echo "File $CACHE_PATH/$FOLDER/$SUBFOLDER/$FILE_HASH deleted successfully." >&2
    else
        echo "Error: Failed to delete $CACHE_PATH/$FOLDER/$SUBFOLDER/$FILE_HASH." >&2
    fi
else
    echo "File $CACHE_PATH/$FOLDER/$SUBFOLDER/$FILE_HASH does not exist." >&2
fi
