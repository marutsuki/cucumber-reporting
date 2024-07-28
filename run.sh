#!/bin/bash

OUTDIR='./out'
PROJDIR=''
THEME=''

while getopts 'o:p:t:' flag; do
    case "${flag}" in
        o) OUTDIR="${OPTARG}" ;;
        p) PROJDIR="${OPTARG}" ;;
        t) THEME="${OPTARG}" ;;
        *) echo "Usage: $0 [-o <output directory>] [-p <project directory>] [-t <theme>]" >&2
        exit 1 ;;
    esac
done

ARG1=${@:$OPTIND:1}

if [ $ARG1 != "" ]; then
    cp ./script.js $OUTDIR/script.js
    if [ -x "$basedir/node" ]; then
        exec "$basedir/node_modules/.bin/tailwindcss" -i ./src/ui/globals.css -o $OUTDIR/globals.css
        exec "$basedir/node"  dist/index.js $ARG1 $OUTDIR $PROJDIR $THEME
    else 
        node_modules/.bin/tailwindcss -i ./src/ui/globals.css -o $OUTDIR/globals.css
        node dist/index.js $ARG1 $OUTDIR $PROJDIR $THEME
    fi
fi

