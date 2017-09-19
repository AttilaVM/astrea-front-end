#!/bin/bash

# TODO normalize paht-names

inputDir="../data/mrbrain-8bit/"

imgFiles=$(find "$inputDir" \
								-iname "*.png" \
								-o -iname "*.tif" \
							 | sort)
imgNum=$(wc -l "$imgFiles")

inputImgFiles=$(echo -e "$imgFiles" \
										| sed "s/$/ /" \
										| tr -d '\n')

echo "\e[92mGenerating montage"
montage $inputImgFiles \
				-tile 1x \
				-frame 0 \
				-geometry +0+0 \
				out.png
