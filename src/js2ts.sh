#!/bin/bash

for file in $(find . -name "*$1"); do
  mv "$file" "${file%$1}$2"
done

find ./src -type f -exec sed -i 's/<script>/<script lang="ts">/' {} \;
