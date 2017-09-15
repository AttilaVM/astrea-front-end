#!/bin/bash

inputDir="/home/attila/projects/volumetric_rendering/data/mrbrain-8bit"

imgFiles=$(find "$inputDir" \
								-iname "*.png" \
								-o -iname "*.tif" \
							 | sort)
imgNum=$(wc -l "$imgFiles")

# single quote items in file list and substitute line breaks with spaces
# inputImgFiles=$(echo -e "$imgFiles" \
#											| sed "s/^/\'/" \
#											| sed "s/$/\' /" \
#											| tr -d '\n')

echo "$imgFiles"

inputImgFiles=$(echo -e "$imgFiles" \
										| sed "s/$/ /" \
										| tr -d '\n')

montage $inputImgFiles \
				-tile 1x \
				-frame 0 \
				-geometry +0+0 \
				out.png
